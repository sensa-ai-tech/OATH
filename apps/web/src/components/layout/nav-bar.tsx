/**
 * 底部導航列
 */

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';
import { createWebAuthAdapter } from '@/lib/supabase/auth-adapter';

const NAV_ITEMS = [
  { href: '/daily', labelKey: 'daily.title' as const, icon: 'sun' },
  { href: '/chart', labelKey: 'chart.title' as const, icon: 'chart' },
  { href: '/profile', labelKey: 'profile.title' as const, icon: 'user' },
] as const;

function NavIcon({ type }: { type: string }) {
  switch (type) {
    case 'sun':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case 'chart':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="22" />
          <line x1="2" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="22" y2="12" />
        </svg>
      );
    case 'user':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const session = useAuthStore((s) => s.session);

  const handleLogout = async () => {
    try {
      const adapter = createWebAuthAdapter();
      await adapter.signOut();
      useAuthStore.getState().setSession(null);
      router.push('/login');
    } catch {
      // 登出失敗仍清除本地 session
      useAuthStore.getState().setSession(null);
      router.push('/login');
    }
  };

  if (!session) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2"
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderColor: 'var(--color-surface-card-hover)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-1 px-4 transition-colors"
            style={{
              color: isActive
                ? 'var(--color-brand-primary)'
                : 'var(--color-text-muted)',
            }}
          >
            <NavIcon type={item.icon} />
            <span className="text-xs">{t(item.labelKey)}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-0.5 py-1 px-4 transition-colors"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="text-xs">{t('auth.logout')}</span>
      </button>
    </nav>
  );
}
