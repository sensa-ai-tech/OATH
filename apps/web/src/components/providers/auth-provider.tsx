/**
 * Auth Provider — 初始化 auth adapter + 監聽 session 變化
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';
import { setAuthTokenGetter } from '@oath/ui-kit/api/client';
import { initSupabase } from '@oath/ui-kit/api/supabase';
import { createWebAuthAdapter } from '@/lib/supabase/auth-adapter';

interface AuthProviderProps {
  readonly children: ReactNode;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
}

export function AuthProvider({
  children,
  supabaseUrl,
  supabaseAnonKey,
}: AuthProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 1. 初始化 Supabase config（供 Edge Function 呼叫用）
    initSupabase({ url: supabaseUrl, anonKey: supabaseAnonKey });

    // 2. 建立 Auth Adapter
    const adapter = createWebAuthAdapter();

    // 3. 注入 token getter（供 API client 自動帶入 auth token）
    setAuthTokenGetter(async () => {
      const session = await adapter.getSession();
      return session?.accessToken ?? null;
    });

    // 4. 載入初始 session
    void adapter.getSession().then((session) => {
      useAuthStore.getState().setSession(session);
    });

    // 5. 監聽 session 變化
    const unsubscribe = adapter.onAuthStateChange((session) => {
      useAuthStore.getState().setSession(session);
    });

    return () => {
      unsubscribe();
    };
  }, [supabaseUrl, supabaseAnonKey]);

  return <>{children}</>;
}
