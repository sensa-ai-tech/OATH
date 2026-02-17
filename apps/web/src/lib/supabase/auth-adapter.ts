/**
 * Web Supabase Auth Adapter
 *
 * 實作 ui-kit 的 AuthAdapter 介面，
 * 使用 @supabase/ssr 的 browser client 進行驗證。
 */

'use client';

import type {
  AuthAdapter,
  AuthSession,
  SignUpData,
} from '@oath/ui-kit/auth/auth-interface';
import { createClient } from './client';

function mapSession(session: {
  user: { id: string; email?: string };
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}): AuthSession {
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
    },
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
  };
}

export function createWebAuthAdapter(): AuthAdapter {
  const supabase = createClient();

  return {
    async signInWithEmail(
      email: string,
      password: string,
    ): Promise<AuthSession> {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error('No session returned');
      return mapSession(data.session);
    },

    async signInWithGoogle(): Promise<AuthSession> {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw new Error(error.message);
      // OAuth 重定向後 session 會由 callback 頁面處理
      // 這裡回傳空 session（不會實際使用到）
      throw new Error('Redirecting to Google OAuth...');
    },

    async signUp(data: SignUpData): Promise<AuthSession> {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            birth_datetime: data.birthDatetime,
            birth_latitude: data.birthLatitude,
            birth_longitude: data.birthLongitude,
            birth_timezone: data.birthTimezone,
            birth_time_precision: data.birthTimePrecision,
            gender: data.gender,
          },
        },
      });
      if (error) throw new Error(error.message);
      if (!authData.session) {
        throw new Error('請檢查您的電子信箱以確認帳號');
      }
      return mapSession(authData.session);
    },

    async signOut(): Promise<void> {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },

    async getSession(): Promise<AuthSession | null> {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return null;
      return mapSession(session);
    },

    onAuthStateChange(
      callback: (session: AuthSession | null) => void,
    ): () => void {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session ? mapSession(session) : null);
      });
      return () => subscription.unsubscribe();
    },

    async deleteAccount(): Promise<void> {
      // 標記帳號為待刪除（30 天冷卻期）
      // 實際刪除由後端 cron job 處理
      const { error } = await supabase.rpc('oath_request_account_deletion');
      if (error) throw new Error(error.message);
    },

    async restoreAccount(): Promise<void> {
      const { error } = await supabase.rpc('oath_cancel_account_deletion');
      if (error) throw new Error(error.message);
    },
  };
}
