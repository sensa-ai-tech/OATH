/**
 * 每日運勢狀態管理
 */

import { create } from 'zustand';
import type { DailyFortune, ApiError } from '@oath/shared/types/index.js';

interface FortuneState {
  today: DailyFortune | null;
  history: DailyFortune[];
  loading: boolean;
  error: ApiError | null;
  fetchToday: () => Promise<void>;
  fetchHistory: (from: string, to: string) => Promise<void>;
  clearError: () => void;
}

export const useFortuneStore = create<FortuneState>()((set) => ({
  today: null,
  history: [],
  loading: false,
  error: null,

  fetchToday: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Phase 2 — 實際 API 呼叫
      set({ loading: false });
    } catch {
      set({
        loading: false,
        error: {
          code: 'GEN_001',
          message: 'Failed to fetch daily fortune',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  fetchHistory: async (_from: string, _to: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Phase 2 — 實際 API 呼叫
      set({ loading: false });
    } catch {
      set({
        loading: false,
        error: {
          code: 'GEN_001',
          message: 'Failed to fetch fortune history',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
