/**
 * Auth 跨平台抽象介面
 *
 * Web 和 Mobile 各自實作此介面：
 * - Web: @supabase/ssr + cookie + redirect flow
 * - Mobile: @supabase/supabase-js + SecureStore + deep link
 */

export interface AuthSession {
  readonly user: {
    readonly id: string;
    readonly email: string;
  };
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
}

export interface SignUpData {
  readonly email: string;
  readonly password: string;
  /** ISO 8601 */
  readonly birthDatetime: string;
  readonly birthLatitude?: number;
  readonly birthLongitude?: number;
  readonly birthTimezone: string;
  readonly birthTimePrecision: 'exact' | 'approximate' | 'unknown';
  readonly gender?: 'male' | 'female';
}

type Unsubscribe = () => void;

export interface AuthAdapter {
  signInWithEmail(email: string, password: string): Promise<AuthSession>;
  signInWithGoogle(): Promise<AuthSession>;
  signUp(data: SignUpData): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): Unsubscribe;
  /** 啟動 30 天冷卻期 */
  deleteAccount(): Promise<void>;
  /** 冷卻期內恢復 */
  restoreAccount(): Promise<void>;
}
