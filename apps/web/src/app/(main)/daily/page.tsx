'use client';

import { useTranslations } from 'next-intl';
import { useDailyFortune } from '@oath/ui-kit/hooks/use-daily-fortune';
import { NavBar } from '@/components/layout/nav-bar';

export default function DailyFortunePage() {
  const t = useTranslations();
  const { today, loading, error, isOffline, fetchToday, clearError } =
    useDailyFortune({ autoFetch: true });

  return (
    <>
      <main className="min-h-screen pb-20 px-4 pt-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t('daily.title')}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {new Date().toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>

        {/* Offline banner */}
        {isOffline && (
          <div
            className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--color-brand-secondary, #E6A84C)',
              color: 'var(--color-surface-bg)',
            }}
          >
            {t('daily.offline')}
          </div>
        )}

        {/* Loading state */}
        {loading && !today && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin mb-4"
              style={{
                borderColor: 'var(--color-surface-card-hover)',
                borderTopColor: 'var(--color-brand-primary)',
              }}
            />
            <p style={{ color: 'var(--color-text-muted)' }}>
              {t('common.loading')}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !today && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {error.message}
            </p>
            <button
              onClick={() => {
                clearError();
                void fetchToday();
              }}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !today && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <p style={{ color: 'var(--color-text-muted)' }}>
              {t('daily.noData')}
            </p>
            <button
              onClick={() => void fetchToday()}
              className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Fortune Card */}
        {today && (
          <div className="space-y-4">
            {/* Main message card */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <p
                className="text-lg leading-relaxed"
                style={{
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                {today.polishedMessage ?? today.templateMessage}
              </p>
            </div>

            {/* Action suggestion */}
            {today.actionSuggestion && (
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderLeft: '3px solid var(--color-brand-secondary)',
                }}
              >
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--color-brand-secondary)' }}
                >
                  {t('daily.actionTitle')}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {today.actionSuggestion}
                </p>
              </div>
            )}

            {/* Transit & Bazi summary */}
            <div className="grid grid-cols-2 gap-3">
              {today.astrologyTransit && (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'var(--color-surface-card)' }}
                >
                  <h4
                    className="text-xs font-medium mb-2"
                    style={{ color: 'var(--color-brand-accent)' }}
                  >
                    {t('chart.tab.astrology')}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Moon in{' '}
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {today.astrologyTransit.moonSign}
                    </span>
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {today.astrologyTransit.significantAspects.length} aspects
                  </p>
                </div>
              )}

              {today.baziDayAnalysis && (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'var(--color-surface-card)' }}
                >
                  <h4
                    className="text-xs font-medium mb-2"
                    style={{ color: 'var(--color-brand-secondary)' }}
                  >
                    {t('chart.tab.bazi')}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {today.baziDayAnalysis.dayStem}{' '}
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {today.baziDayAnalysis.dayBranch}
                    </span>
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {today.baziDayAnalysis.dayElement}
                  </p>
                </div>
              )}
            </div>

            {/* Share button */}
            <button
              className="w-full py-3 rounded-xl text-sm font-medium border"
              style={{
                borderColor: 'var(--color-surface-card-hover)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {t('daily.share')}
            </button>
          </div>
        )}
      </main>
      <NavBar />
    </>
  );
}
