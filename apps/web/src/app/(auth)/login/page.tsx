'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createWebAuthAdapter } from '@/lib/supabase/auth-adapter';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/daily';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('emailRequired'));
      return;
    }
    if (!password) {
      setError(t('passwordRequired'));
      return;
    }

    setLoading(true);
    try {
      const adapter = createWebAuthAdapter();
      const session = await adapter.signInWithEmail(email, password);
      useAuthStore.getState().setSession(session);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const adapter = createWebAuthAdapter();
      await adapter.signInWithGoogle();
    } catch {
      // Google OAuth 會 redirect，此 catch 正常
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Oath
        </h1>
        <p
          className="text-center mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('login')}
        </p>

        {/* OAuth error from redirect */}
        {searchParams.get('error') === 'oauth_failed' && (
          <div
            className="mb-4 p-3 rounded-lg text-sm text-center"
            style={{
              backgroundColor: 'var(--color-error-bg, #fef2f2)',
              color: 'var(--color-error, #dc2626)',
            }}
          >
            {t('oauthError')}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                borderColor: 'var(--color-border, #d1d5db)',
                backgroundColor: 'var(--color-bg-input, #fff)',
              }}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                borderColor: 'var(--color-border, #d1d5db)',
                backgroundColor: 'var(--color-bg-input, #fff)',
              }}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p
              className="text-sm text-center"
              style={{ color: 'var(--color-error, #dc2626)' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-brand-primary, #6366f1)' }}
          >
            {loading ? '...' : t('loginSubmit')}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-1" style={{ borderColor: 'var(--color-border, #e5e7eb)' }} />
          <span
            className="px-3 text-sm"
            style={{ color: 'var(--color-text-muted, #9ca3af)' }}
          >
            {t('or')}
          </span>
          <hr className="flex-1" style={{ borderColor: 'var(--color-border, #e5e7eb)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium border transition-opacity disabled:opacity-50"
          style={{
            borderColor: 'var(--color-border, #d1d5db)',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('googleLogin')}
        </button>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('noAccount')}{' '}
          <Link
            href="/register"
            className="font-medium underline"
            style={{ color: 'var(--color-brand-primary, #6366f1)' }}
          >
            {t('register')}
          </Link>
        </p>
      </div>
    </main>
  );
}
