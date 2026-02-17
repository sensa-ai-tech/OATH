/**
 * 每日運勢狀態管理
 *
 * 整合 Edge Function API 呼叫 + 離線快取
 */

import { create } from 'zustand';
import type { DailyFortune, ApiError } from '@oath/shared/types/index.js';
import {
  fetchDailyFortune,
  fetchFortuneRange,
  getTodayDate,
} from '../api/fortune-api.js';

interface FortuneState {
  today: DailyFortune | null;
  history: DailyFortune[];
  loading: boolean;
  error: ApiError | null;
  /** 是否來自離線快取 */
  isOffline: boolean;
  fetchToday: () => Promise<void>;
  fetchHistory: (from: string, to: string) => Promise<void>;
  setToday: (fortune: DailyFortune) => void;
  setOffline: (isOffline: boolean) => void;
  clearError: () => void;
}

export const useFortuneStore = create<FortuneState>()((set) => ({
  today: null,
  history: [],
  loading: false,
  error: null,
  isOffline: false,

  fetchToday: async () => {
    set({ loading: true, error: null });
    try {
      const date = getTodayDate();
      const response = await fetchDailyFortune(date);

      if (response.success) {
        set({
          today: response.data.fortune,
          loading: false,
          isOffline: false,
        });
      } else {
        set({
          loading: false,
          error: {
            code: response.error.code,
            message: response.error.message,
            requestId: response.requestId,
            timestamp: response.timestamp,
          },
        });
      }
    } catch {
      set({
        loading: false,
        error: {
          code: 'GEN_001',
          message: '無法取得每日運勢，請確認網路連線',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  fetchHistory: async (from: string, to: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchFortuneRange(from, to);

      if (response.success) {
        // 將摘要轉為完整格式（API 可能回傳不同結構）
        const fortunes = response.data.fortunes.map((summary) => ({
          id: summary.id,
          userId: '',
          fortuneDate: summary.fortuneDate,
          astrologyTransit: null,
          baziDayAnalysis: null,
          templateId: null,
          templateMessage: summary.message,
          polishedMessage: null,
          actionSuggestion: '',
          shareCardUrl: summary.shareCardUrl,
          llmTokensInput: 0,
          llmTokensOutput: 0,
          llmModel: null,
          llmCostUsd: 0,
          engineVersion: '',
          createdAt: '',
        }));

        set({
          history: fortunes,
          loading: false,
        });
      } else {
        set({
          loading: false,
          error: {
            code: response.error.code,
            message: response.error.message,
            requestId: response.requestId,
            timestamp: response.timestamp,
          },
        });
      }
    } catch {
      set({
        loading: false,
        error: {
          code: 'GEN_001',
          message: '無法取得運勢歷史',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  setToday: (fortune: DailyFortune) => set({ today: fortune }),
  setOffline: (isOffline: boolean) => set({ isOffline }),
  clearError: () => set({ error: null }),
}));
