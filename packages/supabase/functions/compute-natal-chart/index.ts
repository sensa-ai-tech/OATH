/**
 * Edge Function: 聚合命盤計算
 *
 * 平行呼叫 compute-astrology + compute-bazi，合併結果
 * 任一失敗 → 返回成功的那個 + 失敗原因
 * 雙失敗 → 返回 ENGINE_COMPUTATION_FAILED
 */

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Phase 1 TODO:
  // 1. 解析請求 body（birthDatetime, latitude, longitude, gender, timePrecision）
  // 2. 平行呼叫 compute-astrology 和 compute-bazi
  // 3. 合併結果
  // 4. 寫入 natal_charts 表
  // 5. 返回 ComputeNatalChartResponse

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
