import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <h1
          className="text-5xl font-bold mb-3"
          style={{
            color: 'var(--color-brand-primary)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          Oath
        </h1>
        <p
          className="text-lg mb-10"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('home.subtitle')}
        </p>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          {t('home.cta')}
        </Link>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          {[
            { icon: '☀️', label: t('daily.title') },
            { icon: '⭐', label: t('chart.tab.astrology') },
            { icon: '🎋', label: t('chart.tab.bazi') },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <span className="text-2xl">{item.icon}</span>
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="absolute bottom-6 flex gap-6">
        <Link
          href="/privacy"
          className="text-xs underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="text-xs underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Terms
        </Link>
      </div>
    </main>
  );
}
