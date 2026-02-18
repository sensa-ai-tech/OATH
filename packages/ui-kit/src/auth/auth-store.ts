/**
 * Auth 狀態管理（純狀態，不碰平台 API）
 */

import { create } from 'zustand';
import type { AuthSession } from './auth-interface';

interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  readonly isAuthenticated: boolean;
  readonly isPremium: boolean;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  session: null,
  loading: true,

  get isAuthenticated() {
    return get().session !== null;
  },

  get isPremium() {
    // TODO: Phase 2 — 從 profile 取得 subscription_tier
    return false;
  },

  setSession: (session) => set({ session, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
