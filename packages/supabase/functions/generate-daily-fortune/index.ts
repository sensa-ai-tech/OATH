/**
 * Edge Function: 每日運勢生成
 *
 * Phase 2 實作：
 * - 計算每日行運
 * - 模板匹配 + 變數填充
 * - 可選 Claude Haiku 潤色（Premium）
 * - 安全過濾
 * - 寫入 daily_fortunes 表
 */

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: { code: 'CNT_004', message: 'Not implemented — Phase 2' },
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
