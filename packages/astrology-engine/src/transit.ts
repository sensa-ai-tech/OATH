/**
 * 每日行運（Transit）計算
 *
 * 比較當日行星位置與本命盤行星位置，找出重要行運相位。
 * 同時提取當日月亮星座和行星間的重要相位。
 */

import type {
  PlanetPosition,
  AspectData,
  AspectType,
  ZodiacSign,
  Planet,
} from '@oath/shared/types/natal-chart.js';
import type { DailyTransit, TransitEvent } from '@oath/shared/types/daily-fortune.js';
import { ASPECT_ORBS } from '@oath/shared/constants/engine.js';
import { computeAllPlanets } from './planets.js';
import { computeHouses } from './houses.js';

/** 行運使用的容許度（比本命盤更緊） */
const TRANSIT_ORBS: Record<AspectType, number> = {
  conjunction: 6,
  sextile: 4,
  square: 5,
  trine: 6,
  opposition: 6,
};

/** 行運行星權重（外行星影響更大） */
const TRANSIT_WEIGHT: Record<string, number> = {
  sun: 3,
  moon: 2,
  mercury: 2,
  venus: 2,
  mars: 3,
  jupiter: 4,
  saturn: 5,
  uranus: 5,
  neptune: 4,
  pluto: 5,
};

interface AspectDef {
  readonly type: AspectType;
  readonly angle: number;
  readonly orb: number;
}

const TRANSIT_ASPECT_DEFS: readonly AspectDef[] = [
  { type: 'conjunction', angle: 0, orb: TRANSIT_ORBS.conjunction },
  { type: 'sextile', angle: 60, orb: TRANSIT_ORBS.sextile },
  { type: 'square', angle: 90, orb: TRANSIT_ORBS.square },
  { type: 'trine', angle: 120, orb: TRANSIT_ORBS.trine },
  { type: 'opposition', angle: 180, orb: TRANSIT_ORBS.opposition },
];

/**
 * 計算兩個角度之間的距離
 */
function angularDistance(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * 度數 → 星座
 */
function degreeToSign(degree: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  return signs[Math.floor(((degree % 360) + 360) % 360 / 30) % 12]!;
}

/**
 * 生成行運解讀鍵值
 */
function makeInterpretationKey(
  transitPlanet: Planet,
  natalPlanet: Planet,
  aspectType: AspectType,
): string {
  return `transit-${transitPlanet}-${aspectType}-natal-${natalPlanet}`;
}

/**
 * 找出行運行星與本命盤行星之間的重要相位
 */
function findTransitAspects(
  transitPlanets: readonly PlanetPosition[],
  natalPlanets: readonly PlanetPosition[],
): TransitEvent[] {
  const events: TransitEvent[] = [];

  for (const tp of transitPlanets) {
    // 跳過 ascendant/midheaven — 它們不是行運行星
    if (tp.planet === 'ascendant' || tp.planet === 'midheaven') continue;

    for (const np of natalPlanets) {
      if (np.planet === 'ascendant' || np.planet === 'midheaven') continue;

      const distance = angularDistance(tp.degree, np.degree);

      for (const aspectDef of TRANSIT_ASPECT_DEFS) {
        const orb = Math.abs(distance - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          const isApplying = orb < aspectDef.orb / 2;

          const aspect: AspectData = {
            planet1: tp.planet,
            planet2: np.planet,
            type: aspectDef.type,
            angle: distance,
            orb,
            isApplying,
          };

          events.push({
            transitPlanet: tp,
            natalPlanet: np,
            aspect,
            interpretationKey: makeInterpretationKey(tp.planet, np.planet, aspectDef.type),
          });
          break; // 每對只取最強相位
        }
      }
    }
  }

  // 按重要性排序（外行星 > 內行星，容許度小 > 大）
  events.sort((a, b) => {
    const weightA = (TRANSIT_WEIGHT[a.transitPlanet.planet] ?? 1) * (1 / (a.aspect.orb + 0.1));
    const weightB = (TRANSIT_WEIGHT[b.transitPlanet.planet] ?? 1) * (1 / (b.aspect.orb + 0.1));
    return weightB - weightA;
  });

  return events;
}

/**
 * 找出當日行星之間的重要相位（天象）
 */
function findSignificantSkyAspects(
  transitPlanets: readonly PlanetPosition[],
): AspectData[] {
  const aspects: AspectData[] = [];

  // 只看真實行星（不含 ASC/MC）
  const realPlanets = transitPlanets.filter(
    p => p.planet !== 'ascendant' && p.planet !== 'midheaven'
  );

  for (let i = 0; i < realPlanets.length; i++) {
    for (let j = i + 1; j < realPlanets.length; j++) {
      const p1 = realPlanets[i]!;
      const p2 = realPlanets[j]!;
      const distance = angularDistance(p1.degree, p2.degree);

      for (const aspectDef of TRANSIT_ASPECT_DEFS) {
        const orb = Math.abs(distance - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: aspectDef.type,
            angle: distance,
            orb,
            isApplying: orb < aspectDef.orb / 2,
          });
          break;
        }
      }
    }
  }

  // 按容許度排序（越精確越重要）
  aspects.sort((a, b) => a.orb - b.orb);

  return aspects;
}

export interface ComputeTransitInput {
  /** 要計算的日期（UTC） */
  readonly transitDate: Date;
  /** 本命盤行星位置 */
  readonly natalPlanets: readonly PlanetPosition[];
  /** 觀測地緯度（用於宮位計算） */
  readonly latitude: number;
  /** 觀測地經度 */
  readonly longitude: number;
}

/**
 * 計算每日行運
 *
 * @returns DailyTransit 包含行運事件、月亮星座、當日重要天象
 */
export function computeDailyTransit(input: ComputeTransitInput): DailyTransit {
  const { transitDate, natalPlanets, latitude, longitude } = input;

  // 1. 計算當日行星位置（使用中午 12:00 UTC 作為代表值）
  const noonDate = new Date(Date.UTC(
    transitDate.getUTCFullYear(),
    transitDate.getUTCMonth(),
    transitDate.getUTCDate(),
    12, 0, 0,
  ));

  const houseData = computeHouses(noonDate, latitude, longitude);
  const transitPlanets = computeAllPlanets(noonDate, houseData.cusps);

  // 2. 提取月亮星座
  const moon = transitPlanets.find(p => p.planet === 'moon');
  const moonSign: ZodiacSign = moon ? moon.sign : 'aries';

  // 3. 找出行運 → 本命的重要相位
  const transits = findTransitAspects(transitPlanets, natalPlanets);

  // 4. 找出當日天象中的重要相位
  const significantAspects = findSignificantSkyAspects(transitPlanets);

  return {
    transits: transits.slice(0, 10), // 最多 10 個行運事件
    moonSign,
    significantAspects: significantAspects.slice(0, 5), // 最多 5 個天象
  };
}

/**
 * 提取行運的摘要標籤（用於模板匹配）
 */
export function extractTransitTags(transit: DailyTransit): string[] {
  const tags: string[] = [];

  // 月亮星座標籤
  tags.push(`moon-${transit.moonSign}`);

  // 重要行運的相位類型標籤
  for (const event of transit.transits.slice(0, 3)) {
    tags.push(event.aspect.type);
    tags.push(event.transitPlanet.planet);
  }

  // 天象中的相位標籤
  for (const aspect of transit.significantAspects.slice(0, 3)) {
    if (!tags.includes(aspect.type)) {
      tags.push(aspect.type);
    }
  }

  // 逆行行星標籤
  const retroPlanets = transit.transits
    .filter(e => e.transitPlanet.isRetrograde)
    .map(e => e.transitPlanet.planet);

  for (const planet of new Set(retroPlanets)) {
    tags.push(`${planet}-retrograde`);
  }

  return [...new Set(tags)];
}
