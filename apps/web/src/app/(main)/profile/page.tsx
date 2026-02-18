'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';
import { createWebAuthAdapter } from '@/lib/supabase/auth-adapter';

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const adapter = createWebAuthAdapter();
      await adapter.signOut();
      useAuthStore.getState().setSession(null);
      router.push('/login');
    } catch {
      useAuthStore.getState().setSession(null);
      router.push('/login');
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const adapter = createWebAuthAdapter();
      await adapter.deleteAccount();
      await adapter.signOut();
      useAuthStore.getState().setSession(null);
      router.push('/login');
    } catch {
      setLoading(false);
    }
  };

  return (
      <main className="px-4 pt-8 max-w-lg mx-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('profile.title')}
        </h1>

        {/* User info */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: '#fff',
              }}
            >
              {session?.user.email?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {session?.user.email ?? '—'}
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Free Plan
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full text-left rounded-xl p-4 flex items-center justify-between disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <span style={{ color: 'var(--color-text-primary)' }}>
              {t('auth.logout')}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="w-full text-left rounded-xl p-4 flex items-center justify-between disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <span style={{ color: '#ef4444' }}>
              {t('profile.deleteAccount')}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div
              className="rounded-xl p-6 w-full max-w-sm"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h2
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('profile.deleteAccount')}
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('profile.deleteConfirm')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg font-medium border disabled:opacity-50"
                  style={{
                    borderColor: 'var(--color-surface-card-hover)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {loading ? '...' : t('common.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
