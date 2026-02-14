/**
 * 本命盤計算 — 聚合行星 + 宮位 + 相位
 */

import type { AstrologyData, PlanetPosition, ZodiacSign } from '@oath/shared/types/natal-chart.js';
import { computeAllPlanets } from './planets.js';
import { computeHouses } from './houses.js';
import { computeAspects } from './aspects.js';

export interface ComputeAstrologyInput {
  /** UTC 出生時間 */
  readonly birthDatetime: Date;
  /** 出生地緯度 */
  readonly latitude: number;
  /** 出生地經度 */
  readonly longitude: number;
}

/** 度數 → 星座 */
function degreeToSign(degree: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  return signs[Math.floor(degree / 30) % 12]!;
}

/**
 * 計算完整西洋占星命盤
 */
export function computeNatalChart(input: ComputeAstrologyInput): AstrologyData {
  const { birthDatetime, latitude, longitude } = input;

  // 1. 計算宮位
  const houseData = computeHouses(birthDatetime, latitude, longitude);

  // 2. 計算行星位置
  const planets = computeAllPlanets(birthDatetime, houseData.cusps);

  // 3. 計算相位
  const aspects = computeAspects(planets);

  // 4. 提取太陽/月亮
  const sun = planets.find((p) => p.planet === 'sun');
  const moon = planets.find((p) => p.planet === 'moon');

  if (!sun || !moon) {
    throw new Error('Failed to compute Sun or Moon position');
  }

  // 5. ASC
  const ascendant: PlanetPosition = {
    planet: 'ascendant',
    sign: degreeToSign(houseData.ascendantDegree),
    degree: houseData.ascendantDegree,
    signDegree: houseData.ascendantDegree % 30,
    house: 1,
    isRetrograde: false,
  };

  // 6. MC
  const midheaven: PlanetPosition = {
    planet: 'midheaven',
    sign: degreeToSign(houseData.midheavenDegree),
    degree: houseData.midheavenDegree,
    signDegree: houseData.midheavenDegree % 30,
    house: 10,
    isRetrograde: false,
  };

  return {
    sun,
    moon,
    ascendant,
    planets: [...planets, ascendant, midheaven],
    aspects,
    houseCusps: houseData.cusps,
  };
}
