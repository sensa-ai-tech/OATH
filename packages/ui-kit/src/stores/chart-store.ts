/**
 * 命盤狀態管理
 */

import { create } from 'zustand';
import type { NatalChart, ApiError } from '@oath/shared/types/index.js';

interface ChartState {
  natalChart: NatalChart | null;
  loading: boolean;
  error: ApiError | null;
  compute: () => Promise<void>;
  recompute: () => Promise<void>;
  clearError: () => void;
}

export const useChartStore = create<ChartState>()((set) => ({
  natalChart: null,
  loading: false,
  error: null,

  compute: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Phase 2 — 實際 API 呼叫
      set({ loading: false });
    } catch {
      set({
        loading: false,
        error: {
          code: 'ENG_001',
          message: 'Failed to compute natal chart',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  recompute: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Phase 2 — 引擎版本升級時重算
      set({ loading: false });
    } catch {
      set({
        loading: false,
        error: {
          code: 'ENG_001',
          message: 'Failed to recompute natal chart',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
