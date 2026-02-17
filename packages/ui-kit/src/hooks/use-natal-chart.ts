/**
 * 命盤 Hook — 整合 Store + 離線快取
 *
 * 邏輯流程：
 * 1. 先嘗試從 store 取得命盤
 * 2. 若無，嘗試從離線快取取得
 * 3. 若無，呼叫 Edge Function API
 * 4. 成功後寫入離線快取
 */

import { useCallback, useEffect, useRef } from 'react';
import { useChartStore } from '../stores/chart-store.js';
import type { OfflineCacheManager } from '../stores/offline-cache.js';
import type { NatalChart, ApiError } from '@oath/shared/types/index.js';

interface UseNatalChartOptions {
  /** 離線快取管理器（由平台注入） */
  readonly cacheManager?: OfflineCacheManager;
  /** 使用者 ID（用於快取鍵值） */
  readonly userId?: string;
  /** 是否自動載入命盤 */
  readonly autoFetch?: boolean;
}

interface UseNatalChartReturn {
  readonly natalChart: NatalChart | null;
  readonly loading: boolean;
  readonly error: ApiError | null;
  readonly needsRecompute: boolean;
  readonly compute: () => Promise<void>;
  readonly recompute: () => Promise<void>;
  readonly clearError: () => void;
}

export function useNatalChart(
  options: UseNatalChartOptions = {},
): UseNatalChartReturn {
  const { cacheManager, userId, autoFetch = true } = options;
  const store = useChartStore();
  const hasFetchedRef = useRef(false);

  // 包裝 compute — 加入離線快取邏輯
  const compute = useCallback(async () => {
    // 先嘗試離線快取
    if (cacheManager && userId) {
      const cached = await cacheManager.getCachedChart(userId);
      if (cached) {
        store.setNatalChart(cached as NatalChart);
      }
    }

    // 呼叫 API
    try {
      await store.compute();

      // 成功後寫入快取
      const chart = useChartStore.getState().natalChart;
      if (chart && cacheManager && userId) {
        await cacheManager.cacheChart(userId, chart);
      }
    } catch {
      // API 失敗但有快取 → 使用快取
      if (!useChartStore.getState().natalChart && cacheManager && userId) {
        const cached = await cacheManager.getCachedChart(userId);
        if (cached) {
          store.setNatalChart(cached as NatalChart);
        }
      }
    }
  }, [cacheManager, userId, store]);

  // 自動載入
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current && !store.natalChart && userId) {
      hasFetchedRef.current = true;
      void compute();
    }
  }, [autoFetch, compute, store.natalChart, userId]);

  return {
    natalChart: store.natalChart,
    loading: store.loading,
    error: store.error,
    needsRecompute: store.needsRecompute,
    compute,
    recompute: store.recompute,
    clearError: store.clearError,
  };
}
