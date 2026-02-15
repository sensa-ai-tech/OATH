/**
 * CORS 設定 — Edge Function 共用
 */

/** CORS 預設 headers */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
} as const;

/**
 * 處理 CORS preflight 請求
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

/**
 * 建立帶 CORS headers 的 JSON 回應
 */
export function jsonResponse(
  data: unknown,
  status: number = 200,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * 建立錯誤回應
 */
export function errorResponse(
  code: string,
  message: string,
  status: number,
  requestId: string,
  details?: Record<string, unknown>,
): Response {
  return jsonResponse(
    {
      error: {
        code,
        message,
        details,
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    status,
  );
}
