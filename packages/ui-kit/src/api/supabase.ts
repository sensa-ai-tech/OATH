/**
 * Supabase Client 工廠
 *
 * 提供平台無關的 Supabase 初始化。
 * Web 和 Mobile 各自注入 URL + Key，共用同一 client instance。
 */

/** Supabase 設定 */
export interface SupabaseConfig {
  readonly url: string;
  readonly anonKey: string;
}

/** Supabase client 狀態 */
let supabaseConfig: SupabaseConfig | null = null;

/**
 * 初始化 Supabase 設定
 * 應在 App 啟動時呼叫一次
 */
export function initSupabase(config: SupabaseConfig): void {
  supabaseConfig = config;
}

/**
 * 取得已初始化的 Supabase 設定
 * @throws 若尚未初始化
 */
export function getSupabaseConfig(): SupabaseConfig {
  if (!supabaseConfig) {
    throw new Error(
      'Supabase 尚未初始化。請先呼叫 initSupabase({ url, anonKey })',
    );
  }
  return supabaseConfig;
}

/**
 * 取得 Supabase Edge Function 的完整 URL
 */
export function getEdgeFunctionUrl(functionName: string): string {
  const config = getSupabaseConfig();
  return `${config.url}/functions/v1/${functionName}`;
}

/**
 * 檢查 Supabase 是否已初始化
 */
export function isSupabaseInitialized(): boolean {
  return supabaseConfig !== null;
}
