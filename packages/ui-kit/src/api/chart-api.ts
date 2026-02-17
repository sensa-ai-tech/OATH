/**
 * Chart API — 命盤相關 API 呼叫
 */

import type {
  ApiResponse,
  ComputeNatalChartResponse,
} from '@oath/shared/types/api.js';
import { callEdgeFunction } from './client.js';

/**
 * 計算個人命盤（占星 + 八字聚合）
 * 首次計算或重算時呼叫
 */
export async function computeNatalChart(): Promise<
  ApiResponse<ComputeNatalChartResponse>
> {
  return callEdgeFunction<ComputeNatalChartResponse>(
    'compute-natal-chart',
    { method: 'POST' },
  );
}

/**
 * 重新計算命盤（引擎版本升級時）
 */
export async function recomputeNatalChart(): Promise<
  ApiResponse<ComputeNatalChartResponse>
> {
  return callEdgeFunction<ComputeNatalChartResponse>(
    'compute-natal-chart',
    {
      method: 'POST',
      body: { recompute: true },
    },
  );
}

/**
 * 計算占星資料（獨立呼叫）
 */
export async function computeAstrology(params: {
  readonly birthDatetime: string;
  readonly latitude: number;
  readonly longitude: number;
}): Promise<ApiResponse<unknown>> {
  return callEdgeFunction<unknown>('compute-astrology', {
    method: 'POST',
    body: params,
  });
}

/**
 * 計算八字資料（獨立呼叫）
 */
export async function computeBazi(params: {
  readonly birthDatetime: string;
  readonly timezone: string;
  readonly longitude: number;
}): Promise<ApiResponse<unknown>> {
  return callEdgeFunction<unknown>('compute-bazi', {
    method: 'POST',
    body: params,
  });
}
