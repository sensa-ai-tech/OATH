import { useTranslations } from 'next-intl';

export default function ChartPage() {
  const t = useTranslations('chart');

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      {/* Phase 3 實作命盤頁 UI */}
      <p style={{ color: 'var(--color-text-muted)' }}>
        Natal Chart UI — Phase 3
      </p>
    </main>
  );
}
