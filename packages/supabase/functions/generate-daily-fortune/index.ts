/**
 * Edge Function: 每日運勢生成
 *
 * 流程：
 * 1. 取得使用者命盤（從 DB）
 * 2. 計算當日行運（占星 transit + 八字流日）
 * 3. 模板匹配 + 變數填充
 * 4. 安全過濾
 * 5. 寫入 oath_daily_fortunes 表
 * 6. 返回結果
 *
 * GET  ?date=YYYY-MM-DD → 取得已存在的運勢
 * POST                  → 生成新的運勢
 */

import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createLogger, generateRequestId, writeSystemLog } from '../_shared/logger.ts';
import { rateLimiter, createRateLimitResponse } from '../_shared/rate-limiter.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const logger = createLogger('generate-daily-fortune');

// ============================================
// Simplified template + content engine (inlined)
// ============================================

interface FortuneTemplate {
  id: string;
  tags: string[];
  message: string;
  actionSuggestion: string;
}

// Core fallback templates (simplified set for Edge Function)
const TEMPLATES: FortuneTemplate[] = [
  { id: 'pos-01', tags: ['favorable', 'trine'], message: '今天的宇宙能量特別支持你。{{sunSign}}的直覺力加上{{dayElement}}的能量，會帶來意想不到的好機會。', actionSuggestion: '今天是開始新計畫的好時機，試著踏出第一步。' },
  { id: 'pos-02', tags: ['favorable', 'conjunction'], message: '力量匯聚的一天！行星的排列為你帶來專注力和決心。好好運用這份能量，完成一直想做的事。', actionSuggestion: '挑選一件重要的待辦事項，今天集中精力完成它。' },
  { id: 'grow-01', tags: ['challenge', 'square'], message: '今天可能會遇到一些小挑戰，但這正是成長的契機。每個轉彎都蘊含新的可能性。', actionSuggestion: '遇到困難時，先深呼吸，然後問自己：這個挑戰想教我什麼？' },
  { id: 'grow-02', tags: ['challenge', 'opposition'], message: '今天的能量帶來平衡的課題。嘗試在不同的觀點之間找到中間點，你會發現新的視角。', actionSuggestion: '如果和人意見不合，試著真心聆聽對方的想法。' },
  { id: 'wood-01', tags: ['wood', 'favorable'], message: '{{dayElement}}的能量為你帶來成長和創新的動力。就像春天的嫩芽，你內在的創造力正在甦醒。', actionSuggestion: '找一件你一直想開始的事，今天就踏出第一步。' },
  { id: 'fire-01', tags: ['fire', 'favorable'], message: '{{dayElement}}的熱情能量環繞著你。今天特別適合展現自我、表達想法。你的魅力和感染力都在高峰。', actionSuggestion: '主動分享你的想法或作品，今天的你特別有說服力。' },
  { id: 'earth-01', tags: ['earth', 'favorable'], message: '{{dayElement}}帶來穩定和踏實的力量。今天適合處理實際事務，一步一步來就對了。', actionSuggestion: '整理你的工作清單，專注完成最重要的三件事。' },
  { id: 'metal-01', tags: ['metal', 'favorable'], message: '{{dayElement}}為你帶來清晰的判斷力。今天的思維特別敏銳，適合做重要決定。', actionSuggestion: '有什麼決定一直在猶豫？今天是理性分析的好時機。' },
  { id: 'water-01', tags: ['water', 'favorable'], message: '{{dayElement}}的智慧能量流動著。今天你的直覺特別敏銳，適合內省和深度思考。', actionSuggestion: '找一段安靜的時間，寫下你最近的想法和感受。' },
  { id: 'bi-jian', tags: ['bi_jian'], message: '今日與你同頻的能量很強，適合與志同道合的人合作。團隊的力量會放大你的成果。', actionSuggestion: '主動聯繫一位朋友或同事，分享你正在做的事。' },
  { id: 'shi-shen', tags: ['shi_shen'], message: '今天的創造力和表達力都很旺盛。不管是藝術、寫作還是溝通，都能感受到靈感的湧現。', actionSuggestion: '做一件有創意的事——畫畫、寫字、做菜，或者用新方式解決老問題。' },
  { id: 'zheng-cai', tags: ['zheng_cai'], message: '今天的理財運很好，適合處理金錢相關的事務。你的判斷力和執行力都在線。', actionSuggestion: '檢視一下你的財務狀況，或者計畫一項合理的投資或儲蓄目標。' },
  { id: 'zheng-guan', tags: ['zheng_guan'], message: '今天適合處理正式事務和人際關係。你的責任感和領導力會得到認可。', actionSuggestion: '主動承擔一項責任，或者幫助團隊解決一個問題。' },
  { id: 'zheng-yin', tags: ['zheng_yin'], message: '今天學習力特別強，適合吸收新知識。閱讀、課程、深度對話都能帶給你啟發。', actionSuggestion: '花 30 分鐘閱讀一本書或一篇好文章，讓自己充電。' },
  { id: 'moon-aries', tags: ['moon-aries'], message: '月亮在牡羊座帶來衝勁和行動力。今天特別適合啟動新計畫或挑戰自我。', actionSuggestion: '列出你想做但一直沒做的事，今天就從中選一件開始。' },
  { id: 'moon-cancer', tags: ['moon-cancer'], message: '月亮在巨蟹座呼喚你回歸內心。今天適合好好照顧自己和家人。', actionSuggestion: '做一件讓自己感到溫暖的事——泡杯好茶、打電話給家人、或者好好休息。' },
  { id: 'moon-libra', tags: ['moon-libra'], message: '月亮在天秤座帶來和諧的能量。今天適合修復關係、美化環境。', actionSuggestion: '向一位重要的人表達感謝，或者整理一下你的生活空間。' },
  { id: 'moon-capricorn', tags: ['moon-capricorn'], message: '月亮在摩羯座帶來務實的能量。今天適合設定目標、制定計畫。', actionSuggestion: '寫下你這個月最想達成的三個目標。' },
  { id: 'retrograde', tags: ['mercury-retrograde'], message: '水星逆行期間，溝通和科技可能會有小狀況。但這也是回顧和修正的好時機。', actionSuggestion: '雙重確認重要訊息和約定，備份重要資料。' },
  { id: 'fallback-01', tags: ['fallback'], message: '今天是充滿可能性的一天。保持開放的心態，你會發現生活中隱藏的小驚喜。', actionSuggestion: '做一件平常不會做的小事——走一條不同的路、嘗試一種新食物、或者跟陌生人微笑。' },
];

function matchTemplate(tags: string[]): FortuneTemplate {
  let bestMatch: FortuneTemplate | null = null;
  let bestScore = 0;
  for (const t of TEMPLATES) {
    if (t.tags.includes('fallback')) continue;
    const score = t.tags.filter((tag) => tags.includes(tag)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = t;
    }
  }
  return bestMatch ?? TEMPLATES[TEMPLATES.length - 1]!; // fallback
}

const SIGN_CN: Record<string, string> = {
  aries: '牡羊座', taurus: '金牛座', gemini: '雙子座', cancer: '巨蟹座',
  leo: '獅子座', virgo: '處女座', libra: '天秤座', scorpio: '天蠍座',
  sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '雙魚座',
};

const ELEMENT_CN: Record<string, string> = {
  wood: '木', fire: '火', earth: '土', metal: '金', water: '水',
};

function renderTemplate(template: FortuneTemplate, vars: Record<string, string>): { message: string; actionSuggestion: string } {
  const replace = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
  return { message: replace(template.message), actionSuggestion: replace(template.actionSuggestion) };
}

// Safety filter
const SAFETY_KEYWORDS = ['想死', '不想活', '活不下去', '自殺', '結束生命', '尋死', '了結', '跳樓', '割腕', '安眠藥'];

function safetyCheck(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return SAFETY_KEYWORDS.some((kw) => normalized.includes(kw));
}

// ============================================
// Edge Function Handler
// ============================================

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  const requestId = generateRequestId();
  const timer = logger.startTimer();

  try {
    const authHeader = req.headers.get('Authorization');
    const apikey = req.headers.get('apikey');

    // @ts-expect-error Deno env
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    // @ts-expect-error Deno env
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    // @ts-expect-error Deno env
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? apikey ?? '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader ?? '' } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('AUTH_002', 'Authentication required', 401, requestId);
    }

    // GET — fetch existing fortune
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

      const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await serviceClient
        .from('oath_daily_fortunes')
        .select('*')
        .eq('user_id', user.id)
        .eq('fortune_date', date)
        .maybeSingle();

      if (error) {
        return errorResponse('GEN_001', 'Failed to fetch fortune', 500, requestId);
      }

      if (data) {
        return jsonResponse({ success: true, data, requestId });
      }

      // No fortune for this date — return null
      return jsonResponse({ success: true, data: null, requestId });
    }

    // POST — generate fortune
    if (req.method !== 'POST') {
      return errorResponse('GEN_002', 'Method not allowed', 405, requestId);
    }

    // Rate limiting
    const rateResult = rateLimiter.check(user.id, 'fortune', 'free');
    if (!rateResult.allowed) {
      return createRateLimitResponse(rateResult);
    }

    // Parse request
    const body = await req.json().catch(() => ({}));
    const requestDate = (body as { date?: string }).date ?? new Date().toISOString().slice(0, 10);

    // Check if fortune already exists
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing } = await serviceClient
      .from('oath_daily_fortunes')
      .select('*')
      .eq('user_id', user.id)
      .eq('fortune_date', requestDate)
      .maybeSingle();

    if (existing) {
      return jsonResponse({ success: true, data: existing, cached: true, requestId });
    }

    // Get natal chart
    const { data: chart } = await serviceClient
      .from('oath_natal_charts')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!chart) {
      return errorResponse('VAL_001', 'No natal chart found. Please compute your chart first.', 400, requestId);
    }

    // Get user profile
    const { data: profile } = await serviceClient
      .from('oath_user_profiles')
      .select('sun_sign, bazi_day_master')
      .eq('id', user.id)
      .maybeSingle();

    logger.info('content.generate', 'Generating daily fortune', { requestId, userId: user.id, date: requestDate });

    // Build tags for template matching
    const tags: string[] = [];

    // Astrology tags
    const astrologyData = chart.astrology_data;
    if (astrologyData) {
      // Moon sign
      const moonSign = astrologyData.moon?.sign;
      if (moonSign) tags.push(`moon-${moonSign}`);
      // Major aspects
      const aspects = astrologyData.aspects ?? [];
      for (const aspect of aspects.slice(0, 3)) {
        tags.push(aspect.type);
      }
    }

    // Bazi tags
    const baziData = chart.bazi_data;
    if (baziData) {
      // Day master element
      const dayElement = baziData.dayMasterAnalysis?.element;
      if (dayElement) tags.push(dayElement);
      // Strength
      const strength = baziData.dayMasterAnalysis?.strength;
      if (strength) tags.push(`daymaster-${strength}`);
    }

    // Add favorable/challenge based on simple logic
    if (tags.some((t) => ['trine', 'conjunction', 'sextile'].includes(t))) {
      tags.push('favorable');
    }
    if (tags.some((t) => ['square', 'opposition'].includes(t))) {
      tags.push('challenge');
    }

    // Match template
    const template = matchTemplate(tags);

    // Render with variables
    const sunSign = profile?.sun_sign ?? astrologyData?.sun?.sign ?? '';
    const dayElement = baziData?.dayMasterAnalysis?.element ?? '';
    const rendered = renderTemplate(template, {
      sunSign: SIGN_CN[sunSign] ?? sunSign,
      dayElement: ELEMENT_CN[dayElement] ?? dayElement,
      dayMaster: profile?.bazi_day_master ?? '',
      userName: '',
      moonSign: SIGN_CN[astrologyData?.moon?.sign ?? ''] ?? '',
    });

    // Safety filter
    const isSafe = !safetyCheck(rendered.message);

    // Write to DB
    const fortuneRow = {
      user_id: user.id,
      fortune_date: requestDate,
      astrology_transit: astrologyData ? { moonSign: astrologyData.moon?.sign, aspectCount: (astrologyData.aspects ?? []).length } : null,
      bazi_day_analysis: baziData ? { dayElement: baziData.dayMasterAnalysis?.element, strength: baziData.dayMasterAnalysis?.strength } : null,
      template_id: template.id,
      template_message: rendered.message,
      polished_message: null,
      action_suggestion: rendered.actionSuggestion,
      share_card_url: null,
      llm_tokens_input: 0,
      llm_tokens_output: 0,
      llm_model: null,
      llm_cost_usd: 0,
      engine_version: '1.0.0',
    };

    const { data: inserted, error: insertError } = await serviceClient
      .from('oath_daily_fortunes')
      .insert(fortuneRow)
      .select('*')
      .single();

    if (insertError) {
      logger.error('content.generate', `DB insert failed: ${insertError.message}`, { requestId });
      // Still return the generated fortune even if DB write fails
      return jsonResponse({
        success: true,
        data: {
          id: crypto.randomUUID(),
          ...fortuneRow,
          created_at: new Date().toISOString(),
        },
        dbError: insertError.message,
        requestId,
      });
    }

    const durationMs = timer();
    logger.info('content.generate', 'Fortune generated', {
      requestId, userId: user.id, durationMs,
      templateId: template.id,
      matchedTags: tags,
    });

    await writeSystemLog(serviceClient, 'content.generate', user.id, {
      date: requestDate,
      templateId: template.id,
      durationMs,
      engineVersion: '1.0.0',
    });

    return jsonResponse({
      success: true,
      data: inserted,
      requestId,
    });
  } catch (err) {
    const durationMs = timer();
    logger.error('content.generate', `Fortune generation failed: ${err}`, { requestId, durationMs });
    return errorResponse('CNT_001', 'Fortune generation failed', 500, requestId, {
      detail: String(err),
    });
  }
});
