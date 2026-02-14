import { useTranslations } from 'next-intl';

export default function DailyFortunePage() {
  const t = useTranslations('daily');

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      {/* Phase 3 實作每日運勢 UI */}
      <p style={{ color: 'var(--color-text-muted)' }}>
        Daily Fortune UI — Phase 3
      </p>
    </main>
  );
}
