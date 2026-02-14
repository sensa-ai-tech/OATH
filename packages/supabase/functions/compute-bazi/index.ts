/**
 * Edge Function: 八字計算（獨立拆分）
 *
 * Phase 1 實作：
 * - 載入 lunar-javascript
 * - 計算四柱 / 十神 / 大運
 * - 返回 BaziData
 */

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Phase 1 TODO: 實際計算邏輯
  return new Response(
    JSON.stringify({
      success: false,
      error: { code: 'ENG_001', message: 'Not implemented — Phase 1' },
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
