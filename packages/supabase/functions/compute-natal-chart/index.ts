/**
 * Edge Function: 聚合命盤計算
 *
 * 平行呼叫 compute-astrology + compute-bazi，合併結果。
 * 寫入 oath_natal_charts 表，返回完整命盤。
 */

import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createLogger, generateRequestId, writeSystemLog } from '../_shared/logger.ts';
import { rateLimiter, createRateLimitResponse } from '../_shared/rate-limiter.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const logger = createLogger('compute-natal-chart');

// ============================================
// Edge Function Handler
// ============================================

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== 'POST') {
    return errorResponse('GEN_002', 'Method not allowed', 405, generateRequestId());
  }

  const requestId = generateRequestId();
  const timer = logger.startTimer();

  try {
    // Auth: get user from JWT
    const authHeader = req.headers.get('Authorization');
    const apikey = req.headers.get('apikey');

    // @ts-expect-error Deno env
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    // @ts-expect-error Deno env
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    // @ts-expect-error Deno env
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? apikey ?? '';

    // Create client with user's JWT for RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader ?? '' } },
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('AUTH_002', 'Authentication required', 401, requestId);
    }

    // Rate limiting
    const rateResult = rateLimiter.check(user.id, 'compute', 'free');
    if (!rateResult.allowed) {
      return createRateLimitResponse(rateResult);
    }

    // Parse request body
    const body = await req.json();
    const {
      birthDatetime, latitude, longitude, gender, timePrecision,
    } = body as {
      birthDatetime: string;
      latitude: number;
      longitude: number;
      gender?: 'male' | 'female';
      timePrecision?: 'exact' | 'approximate' | 'unknown';
    };

    if (!birthDatetime || latitude == null || longitude == null) {
      return errorResponse('VAL_003', 'Missing required fields', 400, requestId);
    }

    logger.info('engine.compute', 'Starting natal chart computation', { requestId, userId: user.id });

    // Parallel call to compute-astrology and compute-bazi
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseAnonKey,
    };

    const [astroResponse, baziResponse] = await Promise.allSettled([
      fetch(`${baseUrl}/functions/v1/compute-astrology`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ birthDatetime, latitude, longitude }),
      }),
      fetch(`${baseUrl}/functions/v1/compute-bazi`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ birthDatetime, longitude, gender, timePrecision }),
      }),
    ]);

    // Parse results
    // deno-lint-ignore no-explicit-any
    let astrologyData: any = null;
    // deno-lint-ignore no-explicit-any
    let baziData: any = null;
    const errors: string[] = [];

    if (astroResponse.status === 'fulfilled' && astroResponse.value.ok) {
      const astroJson = await astroResponse.value.json();
      if (astroJson.success) astrologyData = astroJson.data;
      else errors.push(`Astrology: ${astroJson.error?.message ?? 'Unknown error'}`);
    } else {
      const reason = astroResponse.status === 'rejected'
        ? String(astroResponse.reason)
        : `HTTP ${astroResponse.value.status}`;
      errors.push(`Astrology: ${reason}`);
    }

    if (baziResponse.status === 'fulfilled' && baziResponse.value.ok) {
      const baziJson = await baziResponse.value.json();
      if (baziJson.success) baziData = baziJson.data;
      else errors.push(`Bazi: ${baziJson.error?.message ?? 'Unknown error'}`);
    } else {
      const reason = baziResponse.status === 'rejected'
        ? String(baziResponse.reason)
        : `HTTP ${baziResponse.value.status}`;
      errors.push(`Bazi: ${reason}`);
    }

    // Both failed
    if (!astrologyData && !baziData) {
      logger.error('engine.error', 'Both engines failed', { requestId, errors });
      return errorResponse('ENG_001', 'Natal chart computation failed', 500, requestId, { errors });
    }

    // Build response
    const natalChart = {
      userId: user.id,
      astrologyData: astrologyData ?? null,
      baziData: baziData ?? null,
      engineVersion: '1.0.0',
      computedAt: new Date().toISOString(),
    };

    // Upsert to DB (use service role for write)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: dbData, error: dbError } = await serviceClient
      .from('oath_natal_charts')
      .upsert(
        {
          user_id: user.id,
          astrology_data: astrologyData,
          bazi_data: baziData,
          engine_version: '1.0.0',
          computed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select('id')
      .single();

    const chartId = dbData?.id ?? crypto.randomUUID();

    // Update profile with sun sign and day master
    const sunSign = astrologyData?.sun?.sign ?? null;
    const baziDayMaster = baziData?.dayMasterAnalysis?.dayMaster ?? null;
    if (sunSign || baziDayMaster) {
      const updates: Record<string, string | null> = {};
      if (sunSign) updates.sun_sign = sunSign;
      if (baziDayMaster) updates.bazi_day_master = baziDayMaster;
      await serviceClient
        .from('oath_user_profiles')
        .update(updates)
        .eq('id', user.id);
    }

    // Log
    const durationMs = timer();
    logger.info('engine.compute', 'Natal chart computed', {
      requestId, userId: user.id, durationMs,
      hasAstrology: !!astrologyData,
      hasBazi: !!baziData,
    });

    await writeSystemLog(serviceClient, 'engine.compute', user.id, {
      type: 'natal_chart',
      durationMs,
      hasAstrology: !!astrologyData,
      hasBazi: !!baziData,
      engineVersion: '1.0.0',
    });

    return jsonResponse({
      success: true,
      data: {
        id: chartId,
        ...natalChart,
      },
      warnings: errors.length > 0 ? errors : undefined,
      requestId,
    });
  } catch (err) {
    const durationMs = timer();
    logger.error('engine.error', `Natal chart failed: ${err}`, { requestId, durationMs });
    return errorResponse('ENG_001', 'Natal chart computation failed', 500, requestId, {
      detail: String(err),
    });
  }
});
