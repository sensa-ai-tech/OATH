/**
 * 離線快取策略
 *
 * 策略：
 * - 最近 7 天運勢快取在 localStorage（Web）/ AsyncStorage（Mobile）
 * - 離線時顯示快取 + 「離線模式」提示
 * - 上線後自動同步
 *
 * 架構：
 * - CacheAdapter 介面：Web 和 Mobile 各自注入實作
 * - CacheManager：統一快取管理邏輯
 */

import type { DailyFortune } from '@oath/shared/types/index';

/** 快取項目 */
interface CacheEntry<T> {
  readonly data: T;
  readonly cachedAt: string;
  readonly expiresAt: string;
}

/** 快取存取介面 — Web 和 Mobile 各自實作 */
export interface CacheAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

/** 快取鍵值命名空間 */
const CACHE_NAMESPACE = 'oath_cache';
const FORTUNE_PREFIX = `${CACHE_NAMESPACE}:fortune`;
const CHART_PREFIX = `${CACHE_NAMESPACE}:chart`;

/** 預設快取天數 */
const DEFAULT_FORTUNE_CACHE_DAYS = 7;

/**
 * 離線快取管理器
 */
export class OfflineCacheManager {
  private readonly adapter: CacheAdapter;

  constructor(adapter: CacheAdapter) {
    this.adapter = adapter;
  }

  /**
   * 快取每日運勢
   */
  async cacheFortune(fortune: DailyFortune): Promise<void> {
    const key = `${FORTUNE_PREFIX}:${fortune.fortuneDate}`;
    const entry: CacheEntry<DailyFortune> = {
      data: fortune,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + DEFAULT_FORTUNE_CACHE_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    await this.adapter.setItem(key, JSON.stringify(entry));
  }

  /**
   * 取得快取的運勢
   */
  async getCachedFortune(date: string): Promise<DailyFortune | null> {
    const key = `${FORTUNE_PREFIX}:${date}`;
    const raw = await this.adapter.getItem(key);
    if (!raw) return null;

    try {
      const entry: CacheEntry<DailyFortune> = JSON.parse(raw);

      // 檢查是否過期
      if (new Date(entry.expiresAt) < new Date()) {
        await this.adapter.removeItem(key);
        return null;
      }

      return entry.data;
    } catch {
      // 快取格式錯誤 → 清除
      await this.adapter.removeItem(key);
      return null;
    }
  }

  /**
   * 取得最近 N 天的快取運勢
   */
  async getRecentFortunes(days: number = DEFAULT_FORTUNE_CACHE_DAYS): Promise<DailyFortune[]> {
    const allKeys = await this.adapter.getAllKeys();
    const fortuneKeys = allKeys.filter(k => k.startsWith(FORTUNE_PREFIX));
    const fortunes: DailyFortune[] = [];

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    for (const key of fortuneKeys) {
      const raw = await this.adapter.getItem(key);
      if (!raw) continue;

      try {
        const entry: CacheEntry<DailyFortune> = JSON.parse(raw);
        const fortuneDate = new Date(entry.data.fortuneDate);

        if (fortuneDate >= cutoff && new Date(entry.expiresAt) >= new Date()) {
          fortunes.push(entry.data);
        }
      } catch {
        // 忽略格式錯誤的項目
      }
    }

    // 按日期降序排列
    fortunes.sort((a, b) => b.fortuneDate.localeCompare(a.fortuneDate));
    return fortunes;
  }

  /**
   * 清理過期快取
   */
  async cleanup(): Promise<number> {
    const allKeys = await this.adapter.getAllKeys();
    const cacheKeys = allKeys.filter(k => k.startsWith(CACHE_NAMESPACE));
    let removed = 0;

    for (const key of cacheKeys) {
      const raw = await this.adapter.getItem(key);
      if (!raw) continue;

      try {
        const entry: CacheEntry<unknown> = JSON.parse(raw);
        if (new Date(entry.expiresAt) < new Date()) {
          await this.adapter.removeItem(key);
          removed++;
        }
      } catch {
        // 格式錯誤 → 清除
        await this.adapter.removeItem(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * 快取命盤資料
   */
  async cacheChart(userId: string, chartData: unknown): Promise<void> {
    const key = `${CHART_PREFIX}:${userId}`;
    const entry: CacheEntry<unknown> = {
      data: chartData,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000, // 命盤快取 30 天
      ).toISOString(),
    };
    await this.adapter.setItem(key, JSON.stringify(entry));
  }

  /**
   * 取得快取的命盤
   */
  async getCachedChart(userId: string): Promise<unknown | null> {
    const key = `${CHART_PREFIX}:${userId}`;
    const raw = await this.adapter.getItem(key);
    if (!raw) return null;

    try {
      const entry: CacheEntry<unknown> = JSON.parse(raw);
      if (new Date(entry.expiresAt) < new Date()) {
        await this.adapter.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      await this.adapter.removeItem(key);
      return null;
    }
  }
}

/**
 * Web localStorage 適配器
 */
export class WebStorageAdapter implements CacheAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }

  async getAllKeys(): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
}
