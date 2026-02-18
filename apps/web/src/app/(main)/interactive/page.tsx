'use client';

import { useTranslations } from 'next-intl';

export default function InteractivePage() {
  const t = useTranslations();

  return (
    <main className="px-4 pt-8 max-w-lg mx-auto">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Interactive Readings
      </h1>

      {/* Coming soon cards */}
      <div className="space-y-4">
        {/* Tarot */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl">🃏</span>
            <div>
              <h3
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Tarot Reading
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Coming Soon
              </p>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Draw cards and receive personalized interpretations based on your
            natal chart and current transits.
          </p>
        </div>

        {/* I Ching */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl">☯️</span>
            <div>
              <h3
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                I Ching (易經)
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Coming Soon
              </p>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cast hexagrams and explore ancient wisdom through modern
            interpretation aligned with your Bazi profile.
          </p>
        </div>

        {/* Guided Meditation */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl">🧘</span>
            <div>
              <h3
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Guided Reflection
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Coming Soon
              </p>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Daily prompts and reflections crafted from your fortune insights to
            support mindful growth.
          </p>
        </div>
      </div>

      {/* Notify me */}
      <p
        className="text-center text-sm mt-8"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {t('common.loading')} — Phase 4
      </p>
    </main>
  );
}
