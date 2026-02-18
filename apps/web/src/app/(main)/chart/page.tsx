'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';
import { useNatalChart } from '@oath/ui-kit/hooks/use-natal-chart';
import { NavBar } from '@/components/layout/nav-bar';
import type { PlanetPosition } from '@oath/shared/types/natal-chart';

type Tab = 'astrology' | 'bazi';

/** 天干中文對照 */
const STEM_CN: Record<string, string> = {
  jia: '甲', yi: '乙', bing: '丙', ding: '丁', wu: '戊',
  ji: '己', geng: '庚', xin: '辛', ren: '壬', gui: '癸',
};

/** 地支中文對照 */
const BRANCH_CN: Record<string, string> = {
  zi: '子', chou: '丑', yin: '寅', mao: '卯', chen: '辰', si: '巳',
  wu: '午', wei: '未', shen: '申', you: '酉', xu: '戌', hai: '亥',
};

/** 五行中文對照 */
const ELEMENT_CN: Record<string, string> = {
  wood: '木', fire: '火', earth: '土', metal: '金', water: '水',
};

/** 星座符號 */
const SIGN_SYMBOL: Record<string, string> = {
  aries: '\u2648', taurus: '\u2649', gemini: '\u264A', cancer: '\u264B',
  leo: '\u264C', virgo: '\u264D', libra: '\u264E', scorpio: '\u264F',
  sagittarius: '\u2650', capricorn: '\u2651', aquarius: '\u2652', pisces: '\u2653',
};

function PlanetRow({ planet }: { planet: PlanetPosition }) {
  return (
    <div
      className="flex items-center justify-between py-2 border-b"
      style={{ borderColor: 'var(--color-surface-card-hover)' }}
    >
      <span
        className="text-sm capitalize"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {planet.planet}
        {planet.isRetrograde && (
          <span
            className="ml-1 text-xs"
            style={{ color: 'var(--color-brand-secondary)' }}
          >
            R
          </span>
        )}
      </span>
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {SIGN_SYMBOL[planet.sign] ?? ''}{' '}
        {planet.sign}{' '}
        {planet.signDegree.toFixed(1)}°
      </span>
      <span
        className="text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        H{planet.house}
      </span>
    </div>
  );
}

export default function ChartPage() {
  const t = useTranslations();
  const [tab, setTab] = useState<Tab>('astrology');
  const session = useAuthStore((s) => s.session);
  const { natalChart, loading, error, compute, clearError } =
    useNatalChart({ userId: session?.user.id, autoFetch: true });

  return (
    <>
      <main className="min-h-screen pb-20 px-4 pt-8 max-w-lg mx-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('chart.title')}
        </h1>

        {/* Tabs */}
        <div
          className="flex rounded-lg mb-6 p-1"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          {(['astrology', 'bazi'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor:
                  tab === key ? 'var(--color-brand-primary)' : 'transparent',
                color:
                  tab === key
                    ? '#fff'
                    : 'var(--color-text-muted)',
              }}
            >
              {t(`chart.tab.${key}`)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && !natalChart && (
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

        {/* Error */}
        {error && !natalChart && (
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
                void compute();
              }}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Astrology Tab */}
        {natalChart && tab === 'astrology' && (
          <div className="space-y-4">
            {/* Big Three */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h3
                className="text-xs font-medium mb-3 uppercase tracking-wider"
                style={{ color: 'var(--color-brand-accent)' }}
              >
                Big Three
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  natalChart.astrologyData.sun,
                  natalChart.astrologyData.moon,
                  natalChart.astrologyData.ascendant,
                ].map((p) => (
                  <div key={p.planet}>
                    <p
                      className="text-2xl mb-1"
                    >
                      {SIGN_SYMBOL[p.sign] ?? ''}
                    </p>
                    <p
                      className="text-xs capitalize"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {p.planet}
                    </p>
                    <p
                      className="text-sm capitalize font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {p.sign}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Planets */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h3
                className="text-xs font-medium mb-3 uppercase tracking-wider"
                style={{ color: 'var(--color-brand-accent)' }}
              >
                Planets
              </h3>
              {natalChart.astrologyData.planets.map((p) => (
                <PlanetRow key={p.planet} planet={p} />
              ))}
            </div>

            {/* Aspects */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h3
                className="text-xs font-medium mb-3 uppercase tracking-wider"
                style={{ color: 'var(--color-brand-accent)' }}
              >
                Aspects ({natalChart.astrologyData.aspects.length})
              </h3>
              {natalChart.astrologyData.aspects.slice(0, 10).map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span className="capitalize">{a.planet1}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {a.type}
                  </span>
                  <span className="capitalize">{a.planet2}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {a.orb.toFixed(1)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bazi Tab */}
        {natalChart && tab === 'bazi' && (
          <div className="space-y-4">
            {/* Four Pillars */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h3
                className="text-xs font-medium mb-4 uppercase tracking-wider"
                style={{ color: 'var(--color-brand-secondary)' }}
              >
                Four Pillars
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {([
                  { label: '年', pillar: natalChart.baziData.yearPillar },
                  { label: '月', pillar: natalChart.baziData.monthPillar },
                  { label: '日', pillar: natalChart.baziData.dayPillar },
                  { label: '時', pillar: natalChart.baziData.hourPillar },
                ] as const).map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-xs mb-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {item.label}柱
                    </p>
                    {item.pillar ? (
                      <>
                        <p
                          className="text-xl font-bold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {STEM_CN[item.pillar.heavenlyStem] ?? item.pillar.heavenlyStem}
                        </p>
                        <p
                          className="text-xl"
                          style={{ color: 'var(--color-brand-secondary)' }}
                        >
                          {BRANCH_CN[item.pillar.earthlyBranch] ?? item.pillar.earthlyBranch}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {ELEMENT_CN[item.pillar.stemElement] ?? item.pillar.stemElement}
                          {ELEMENT_CN[item.pillar.branchElement] ?? item.pillar.branchElement}
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        —
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Master Analysis */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-surface-card)' }}
            >
              <h3
                className="text-xs font-medium mb-3 uppercase tracking-wider"
                style={{ color: 'var(--color-brand-secondary)' }}
              >
                Day Master
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {STEM_CN[natalChart.baziData.dayMasterAnalysis.dayMaster] ??
                    natalChart.baziData.dayMasterAnalysis.dayMaster}
                </span>
                <div>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {ELEMENT_CN[natalChart.baziData.dayMasterAnalysis.element] ??
                      natalChart.baziData.dayMasterAnalysis.element}
                  </p>
                  <p
                    className="text-xs capitalize"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {natalChart.baziData.dayMasterAnalysis.strength}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {natalChart.baziData.dayMasterAnalysis.favorableElements.map(
                  (el) => (
                    <span
                      key={el}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-brand-primary)',
                        color: '#fff',
                      }}
                    >
                      {ELEMENT_CN[el] ?? el}
                    </span>
                  ),
                )}
                {natalChart.baziData.dayMasterAnalysis.unfavorableElements.map(
                  (el) => (
                    <span
                      key={el}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-surface-card-hover)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {ELEMENT_CN[el] ?? el}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Luck Pillars */}
            {natalChart.baziData.luckPillars.length > 0 && (
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--color-surface-card)' }}
              >
                <h3
                  className="text-xs font-medium mb-3 uppercase tracking-wider"
                  style={{ color: 'var(--color-brand-secondary)' }}
                >
                  Luck Pillars
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {natalChart.baziData.luckPillars.map((lp, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 text-center px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: 'var(--color-surface-card-hover)',
                      }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {STEM_CN[lp.heavenlyStem] ?? lp.heavenlyStem}
                        {BRANCH_CN[lp.earthlyBranch] ?? lp.earthlyBranch}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {lp.startAge}–{lp.endAge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty — no chart yet */}
        {!loading && !error && !natalChart && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <p style={{ color: 'var(--color-text-muted)' }}>
              {t('common.loading')}
            </p>
          </div>
        )}
      </main>
      <NavBar />
    </>
  );
}
