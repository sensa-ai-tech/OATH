/**
 * 結構化 Logging — Edge Function 專用
 *
 * 事件會寫入 Supabase system_logs 表。
 * 格式遵循 JSON Lines 標準，方便後續分析。
 *
 * 事件類型：
 * - api.request       — API 請求開始
 * - api.response      — API 回應（含延遲）
 * - api.error         — API 錯誤
 * - engine.compute    — 排盤引擎計算
 * - content.generate  — 運勢內容生成
 * - content.polish    — LLM 潤色
 * - safety.trigger    — 安全過濾觸發
 * - auth.login        — 使用者登入
 * - auth.register     — 使用者註冊
 * - rate.limit        — 速率限制觸發
 */

export type LogLevel = 'info' | 'warn' | 'error';

export type EventType =
  | 'api.request'
  | 'api.response'
  | 'api.error'
  | 'engine.compute'
  | 'engine.error'
  | 'content.generate'
  | 'content.polish'
  | 'content.fallback'
  | 'safety.trigger'
  | 'auth.login'
  | 'auth.register'
  | 'auth.logout'
  | 'auth.delete'
  | 'rate.limit'
  | 'system.startup'
  | 'system.error';

interface LogEntry {
  readonly level: LogLevel;
  readonly eventType: EventType;
  readonly message: string;
  readonly userId?: string;
  readonly requestId?: string;
  readonly durationMs?: number;
  readonly metadata?: Record<string, unknown>;
  readonly timestamp: string;
}

/**
 * 結構化日誌記錄器
 *
 * 目前實作：console.log（Edge Function 的 stdout 會被 Supabase 收集）
 * 未來可切換為直接寫入 system_logs 表
 */
class StructuredLogger {
  private readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * 記錄資訊事件
   */
  info(eventType: EventType, message: string, extra?: Partial<LogEntry>): void {
    this.log('info', eventType, message, extra);
  }

  /**
   * 記錄警告事件
   */
  warn(eventType: EventType, message: string, extra?: Partial<LogEntry>): void {
    this.log('warn', eventType, message, extra);
  }

  /**
   * 記錄錯誤事件
   */
  error(eventType: EventType, message: string, extra?: Partial<LogEntry>): void {
    this.log('error', eventType, message, extra);
  }

  /**
   * 計時器 — 測量執行時間
   */
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }

  private log(
    level: LogLevel,
    eventType: EventType,
    message: string,
    extra?: Partial<LogEntry>,
  ): void {
    const entry: LogEntry = {
      level,
      eventType,
      message,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    // 結構化 JSON 輸出（Supabase Edge Function logs 會收集 stdout）
    const output = JSON.stringify({
      service: this.serviceName,
      ...entry,
    });

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }
}

/**
 * 建立服務專屬的 logger
 */
export function createLogger(serviceName: string): StructuredLogger {
  return new StructuredLogger(serviceName);
}

/**
 * 寫入 system_logs 表（非同步，不阻塞主流程）
 *
 * 需要 Supabase client 實例
 */
export async function writeSystemLog(
  supabaseClient: { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<{ error: unknown }> } },
  eventType: EventType,
  userId: string | null,
  metadata: Record<string, unknown>,
): Promise<void> {
  try {
    await supabaseClient
      .from('oath_system_logs')
      .insert({
        event_type: eventType,
        user_id: userId,
        metadata,
      });
  } catch {
    // Logging 失敗不應影響主流程
    console.error(`Failed to write system log: ${eventType}`);
  }
}

/**
 * 產生唯一 request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}
