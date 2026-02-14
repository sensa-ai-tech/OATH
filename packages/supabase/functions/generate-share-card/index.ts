/**
 * Edge Function: 分享卡片生成
 *
 * Phase 3 實作：
 * - 伺服器端生成 PNG（@vercel/og 或 Satori）
 * - 雙尺寸：1080x1920（IG Story）+ 1200x630（預覽）
 * - 上傳到 Supabase Storage
 * - 返回 URL
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
      error: { code: 'GEN_001', message: 'Not implemented — Phase 3' },
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
