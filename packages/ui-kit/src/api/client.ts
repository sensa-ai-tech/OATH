/**
 * API Client 基礎層
 *
 * 統一的 HTTP 請求封裝，支援：
 * - 動態 base URL（平台注入）
 * - 自動帶入 Auth token
 * - Edge Function 呼叫
 * - 型別安全的回應解析
 */

import type { ApiResponse } from '@oath/shared/types/api.js';
import { getEdgeFunctionUrl, getSupabaseConfig } from './supabase.js';

interface FetchOptions {
  readonly method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
  /** 跳過自動帶入 auth token */
  readonly skipAuth?: boolean;
}

/** Auth token 取得器（由 auth adapter 注入） */
let getAccessToken: (() => Promise<string | null>) | null = null;

/**
 * 注入取得 access token 的函式
 * 由平台的 auth adapter 在初始化時呼叫
 */
export function setAuthTokenGetter(
  getter: () => Promise<string | null>,
): void {
  getAccessToken = getter;
}

/** API 基礎路徑（由平台注入，用於非 Edge Function 的 API） */
let apiBaseUrl = '';

export function setApiBaseUrl(url: string): void {
  apiBaseUrl = url;
}

/**
 * 通用 API 請求（用於自定義 endpoint）
 */
export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 自動帶入 auth token
  if (!skipAuth && getAccessToken) {
    const token = await getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as ApiResponse<T>;
  return data;
}

/**
 * 呼叫 Supabase Edge Function
 *
 * 自動處理：
 * - Edge Function URL 組合
 * - Anon Key 帶入
 * - Auth token 帶入
 */
export async function callEdgeFunction<T>(
  functionName: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'POST', body, headers = {}, skipAuth = false } = options;
  const config = getSupabaseConfig();
  const url = getEdgeFunctionUrl(functionName);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': config.anonKey,
    ...headers,
  };

  // 自動帶入 auth token
  if (!skipAuth && getAccessToken) {
    const token = await getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Edge Function 可能不回傳標準 ApiResponse
  // 嘗試解析，若失敗則包裝為錯誤
  try {
    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch {
    if (response.ok) {
      return {
        success: true,
        data: {} as T,
        requestId: '',
      };
    }
    return {
      success: false,
      error: {
        code: 'GEN_001',
        message: `Edge Function ${functionName} 回傳非 JSON 格式 (HTTP ${String(response.status)})`,
      },
      requestId: '',
      timestamp: new Date().toISOString(),
    };
  }
}
