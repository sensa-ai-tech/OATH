/**
 * Fortune API — 每日運勢相關 API 呼叫
 */

import type {
  ApiResponse,
  GetDailyFortuneResponse,
  GetDailyFortuneRangeResponse,
  ShareCardResponse,
} from '@oath/shared/types/api';
import { callEdgeFunction } from './client';

/**
 * 取得指定日期的每日運勢
 * 若當日尚未生成，Edge Function 會自動生成
 */
export async function fetchDailyFortune(
  date: string,
): Promise<ApiResponse<GetDailyFortuneResponse>> {
  return callEdgeFunction<GetDailyFortuneResponse>(
    'generate-daily-fortune',
    {
      method: 'POST',
      body: { date },
    },
  );
}

/**
 * 取得日期範圍內的運勢歷史
 */
export async function fetchFortuneRange(
  from: string,
  to: string,
): Promise<ApiResponse<GetDailyFortuneRangeResponse>> {
  return callEdgeFunction<GetDailyFortuneRangeResponse>(
    'generate-daily-fortune',
    {
      method: 'POST',
      body: { action: 'range', from, to },
    },
  );
}

/**
 * 取得分享卡片 URL
 */
export async function fetchShareCard(
  fortuneId: string,
): Promise<ApiResponse<ShareCardResponse>> {
  return callEdgeFunction<ShareCardResponse>(
    'generate-share-card',
    {
      method: 'POST',
      body: { fortuneId },
    },
  );
}

/**
 * 格式化今日日期為 YYYY-MM-DD
 */
export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${String(year)}-${month}-${day}`;
}
