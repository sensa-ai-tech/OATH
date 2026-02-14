/**
 * API Client 基礎層
 */

import type { ApiResponse } from '@oath/shared/types/api.js';

interface FetchOptions {
  readonly method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
}

/** API 基礎路徑（由平台注入） */
let apiBaseUrl = '';

export function setApiBaseUrl(url: string): void {
  apiBaseUrl = url;
}

export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as ApiResponse<T>;
  return data;
}
