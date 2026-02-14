import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-brand-primary)' }}>
          Oath
        </h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          {t('subtitle')}
        </p>
      </div>
    </main>
  );
}
