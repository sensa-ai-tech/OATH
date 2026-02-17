/**
 * 命盤狀態管理
 *
 * 整合 Edge Function API 呼叫
 */

import { create } from 'zustand';
import type { NatalChart, ApiError } from '@oath/shared/types/index.js';
import {
  computeNatalChart,
  recomputeNatalChart,
} from '../api/chart-api.js';

interface ChartState {
  natalChart: NatalChart | null;
  loading: boolean;
  error: ApiError | null;
  /** 是否有命盤需要重算（引擎版本升級） */
  needsRecompute: boolean;
  compute: () => Promise<void>;
  recompute: () => Promise<void>;
  setNatalChart: (chart: NatalChart) => void;
  clearError: () => void;
}

export const useChartStore = create<ChartState>()((set) => ({
  natalChart: null,
  loading: false,
  error: null,
  needsRecompute: false,

  compute: async () => {
    set({ loading: true, error: null });
    try {
      const response = await computeNatalChart();

      if (response.success) {
        set({
          natalChart: response.data.chart,
          loading: false,
          needsRecompute: false,
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
          code: 'ENG_001',
          message: '無法計算命盤，請稍後再試',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  recompute: async () => {
    set({ loading: true, error: null });
    try {
      const response = await recomputeNatalChart();

      if (response.success) {
        set({
          natalChart: response.data.chart,
          loading: false,
          needsRecompute: false,
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
          code: 'ENG_001',
          message: '無法重算命盤，請稍後再試',
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      });
    }
  },

  setNatalChart: (chart: NatalChart) => set({ natalChart: chart }),
  clearError: () => set({ error: null }),
}));
