/**
 * 每日運勢 Hook — 整合 Store + 離線快取
 *
 * 邏輯流程：
 * 1. 先嘗試從 store 取得今日運勢
 * 2. 若無，嘗試從離線快取取得
 * 3. 若無，呼叫 Edge Function API
 * 4. 成功後寫入離線快取
 */

import { useCallback, useEffect, useRef } from 'react';
import { useFortuneStore } from '../stores/fortune-store.js';
import type { OfflineCacheManager } from '../stores/offline-cache.js';
import type { DailyFortune, ApiError } from '@oath/shared/types/index.js';

interface UseDailyFortuneOptions {
  /** 離線快取管理器（由平台注入） */
  readonly cacheManager?: OfflineCacheManager;
  /** 是否自動載入今日運勢 */
  readonly autoFetch?: boolean;
}

interface UseDailyFortuneReturn {
  readonly today: DailyFortune | null;
  readonly history: DailyFortune[];
  readonly loading: boolean;
  readonly error: ApiError | null;
  readonly isOffline: boolean;
  readonly fetchToday: () => Promise<void>;
  readonly fetchHistory: (from: string, to: string) => Promise<void>;
  readonly clearError: () => void;
}

export function useDailyFortune(
  options: UseDailyFortuneOptions = {},
): UseDailyFortuneReturn {
  const { cacheManager, autoFetch = true } = options;
  const store = useFortuneStore();
  const hasFetchedRef = useRef(false);

  // 包裝 fetchToday — 加入離線快取邏輯
  const fetchToday = useCallback(async () => {
    // 先嘗試離線快取
    if (cacheManager) {
      const today = new Date().toISOString().slice(0, 10);
      const cached = await cacheManager.getCachedFortune(today);
      if (cached) {
        store.setToday(cached);
        store.setOffline(true);
      }
    }

    // 呼叫 API（即使有快取也嘗試更新）
    try {
      await store.fetchToday();

      // 成功後寫入快取
      const fortune = useFortuneStore.getState().today;
      if (fortune && cacheManager) {
        await cacheManager.cacheFortune(fortune);
      }
    } catch {
      // API 失敗但有快取 → 維持離線模式
      if (!useFortuneStore.getState().today && cacheManager) {
        const today = new Date().toISOString().slice(0, 10);
        const cached = await cacheManager.getCachedFortune(today);
        if (cached) {
          store.setToday(cached);
          store.setOffline(true);
        }
      }
    }
  }, [cacheManager, store]);

  // 自動載入
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current && !store.today) {
      hasFetchedRef.current = true;
      void fetchToday();
    }
  }, [autoFetch, fetchToday, store.today]);

  return {
    today: store.today,
    history: store.history,
    loading: store.loading,
    error: store.error,
    isOffline: store.isOffline,
    fetchToday,
    fetchHistory: store.fetchHistory,
    clearError: store.clearError,
  };
}
