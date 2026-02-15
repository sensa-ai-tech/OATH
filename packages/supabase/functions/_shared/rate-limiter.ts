/**
 * Rate Limiting — 基於內存的滑動視窗實作
 *
 * MVP 版本使用內存計數器（適用於單一 Edge Function 實例）。
 * 生產環境應升級為 Upstash Redis 實作。
 *
 * 分層限制：
 * | API 群組       | Free     | Premium   | 視窗      |
 * |----------------|----------|-----------|-----------|
 * | 排盤 compute   | 3 次/天  | 10 次/天  | 24h       |
 * | 運勢 fortune   | 10 次/hr | 60 次/hr  | 1h        |
 * | LLM polish     | 0        | 30 次/天  | 24h       |
 * | 分享 share     | 5 次/天  | 30 次/天  | 24h       |
 * | 一般 general   | 60 次/min| 120 次/min| 1min      |
 */

export type RateLimitTier = 'free' | 'premium';
export type RateLimitGroup = 'compute' | 'fortune' | 'polish' | 'share' | 'general';

interface RateLimitConfig {
  readonly maxRequests: number;
  readonly windowMs: number;
}

/** 各群組的限制配置 */
const RATE_LIMITS: Record<RateLimitGroup, Record<RateLimitTier, RateLimitConfig>> = {
  compute: {
    free: { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 },
    premium: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 },
  },
  fortune: {
    free: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
    premium: { maxRequests: 60, windowMs: 60 * 60 * 1000 },
  },
  polish: {
    free: { maxRequests: 0, windowMs: 24 * 60 * 60 * 1000 },
    premium: { maxRequests: 30, windowMs: 24 * 60 * 60 * 1000 },
  },
  share: {
    free: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 },
    premium: { maxRequests: 30, windowMs: 24 * 60 * 60 * 1000 },
  },
  general: {
    free: { maxRequests: 60, windowMs: 60 * 1000 },
    premium: { maxRequests: 120, windowMs: 60 * 1000 },
  },
};

/** 速率限制檢查結果 */
export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly limit: number;
  readonly resetAt: number;
}

/** 內存中的請求記錄 */
interface RequestRecord {
  timestamps: number[];
}

/**
 * 內存速率限制器（MVP）
 *
 * 生產環境替換方案：
 * ```typescript
 * import { Ratelimit } from '@upstash/ratelimit';
 * import { Redis } from '@upstash/redis';
 * const redis = Redis.fromEnv();
 * const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '24h') });
 * ```
 */
class InMemoryRateLimiter {
  private readonly records = new Map<string, RequestRecord>();

  /**
   * 檢查是否允許請求
   */
  check(
    userId: string,
    group: RateLimitGroup,
    tier: RateLimitTier,
  ): RateLimitResult {
    const config = RATE_LIMITS[group][tier];
    const key = `${group}:${userId}`;
    const now = Date.now();

    // 取得或建立記錄
    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.records.set(key, record);
    }

    // 清除過期記錄
    const windowStart = now - config.windowMs;
    record.timestamps = record.timestamps.filter(t => t > windowStart);

    // 計算剩餘額度
    const remaining = Math.max(0, config.maxRequests - record.timestamps.length);
    const resetAt = record.timestamps.length > 0
      ? record.timestamps[0]! + config.windowMs
      : now + config.windowMs;

    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        limit: config.maxRequests,
        resetAt,
      };
    }

    // 記錄此次請求
    record.timestamps.push(now);

    return {
      allowed: true,
      remaining: remaining - 1,
      limit: config.maxRequests,
      resetAt,
    };
  }

  /** 重置（用於測試） */
  reset(): void {
    this.records.clear();
  }
}

/** 全域單例 */
export const rateLimiter = new InMemoryRateLimiter();

/**
 * 建立 Rate Limit 錯誤回應
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: 'RTE_001',
        message: 'Rate limit exceeded. Please try again later.',
        details: {
          limit: result.limit,
          remaining: result.remaining,
          resetAt: new Date(result.resetAt).toISOString(),
        },
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    },
  );
}
