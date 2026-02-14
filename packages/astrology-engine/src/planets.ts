/**
 * 行星位置計算 — 基於 astronomy-engine (MIT)
 */

import * as Astronomy from 'astronomy-engine';
import type { Planet, ZodiacSign, PlanetPosition } from '@oath/shared/types/natal-chart.js';

/** 度數 → 星座 */
function degreeToSign(degree: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  const index = Math.floor(degree / 30) % 12;
  return signs[index]!;
}

/** 度數 → 星座內度數 (0-30) */
function degreeInSign(degree: number): number {
  return degree % 30;
}

/** astronomy-engine Body 對應 */
const PLANET_BODY_MAP: Record<string, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

/**
 * 計算單一行星位置
 */
function computePlanetPosition(
  planet: Planet,
  date: Date,
  houseCusps: readonly number[],
): PlanetPosition | null {
  const body = PLANET_BODY_MAP[planet];
  if (!body) return null;

  // 取得黃經
  let longitude: number;
  if (body === Astronomy.Body.Moon) {
    // Moon 需要用 GeoVector + Ecliptic
    const vector = Astronomy.GeoVector(body, date, true);
    const ecliptic = Astronomy.Ecliptic(vector);
    longitude = ecliptic.elon;
  } else if (body === Astronomy.Body.Sun) {
    const sunPos = Astronomy.SunPosition(date);
    longitude = sunPos.elon;
  } else {
    // 外行星使用 EclipticLongitude (heliocentric) + 轉 geocentric
    const vector = Astronomy.GeoVector(body, date, true);
    const ecliptic = Astronomy.Ecliptic(vector);
    longitude = ecliptic.elon;
  }

  // 正規化到 0-360
  longitude = ((longitude % 360) + 360) % 360;

  // 判斷所在宮位（根據宮位起始度數）
  const house = determineHouse(longitude, houseCusps);

  // 判斷逆行
  const isRetrograde = checkRetrograde(body, date);

  return {
    planet,
    sign: degreeToSign(longitude),
    degree: longitude,
    signDegree: degreeInSign(longitude),
    house,
    isRetrograde,
  };
}

/**
 * 判斷行星所在宮位
 */
function determineHouse(longitude: number, cusps: readonly number[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = cusps[i]!;
    const nextCusp = cusps[(i + 1) % 12]!;

    if (nextCusp > currentCusp) {
      // 一般情況
      if (longitude >= currentCusp && longitude < nextCusp) return i + 1;
    } else {
      // 跨越 0°（如 350° → 10°）
      if (longitude >= currentCusp || longitude < nextCusp) return i + 1;
    }
  }
  return 1; // fallback
}

/**
 * 判斷是否逆行（比較前後 1 天的黃經）
 */
function checkRetrograde(body: Astronomy.Body, date: Date): boolean {
  // 太陽和月亮不逆行
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;

  const dayBefore = new Date(date.getTime() - 86400000);
  const dayAfter = new Date(date.getTime() + 86400000);

  try {
    const vecBefore = Astronomy.GeoVector(body, dayBefore, true);
    const vecAfter = Astronomy.GeoVector(body, dayAfter, true);
    const eclBefore = Astronomy.Ecliptic(vecBefore);
    const eclAfter = Astronomy.Ecliptic(vecAfter);

    let diff = eclAfter.elon - eclBefore.elon;
    // 處理 360° 跨越
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    return diff < 0;
  } catch {
    return false;
  }
}

/**
 * 計算所有行星位置
 */
export function computeAllPlanets(
  date: Date,
  houseCusps: readonly number[],
): PlanetPosition[] {
  const planets: Planet[] = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  ];

  const positions: PlanetPosition[] = [];
  for (const planet of planets) {
    const pos = computePlanetPosition(planet, date, houseCusps);
    if (pos) positions.push(pos);
  }

  return positions;
}
