/**
 * 占星引擎單元測試
 *
 * 測試策略：
 * 1. 行星位置 — 已知日期太陽/月亮位置驗證
 * 2. 宮位計算 — ASC/MC 合理性
 * 3. 相位計算 — 已知角度匹配
 * 4. 完整命盤 — 結構完整性
 * 5. 南半球 — 雪梨案例
 * 6. Fuzz — 隨機不 crash
 */

import { describe, it, expect } from 'vitest';
import { computeNatalChart } from '../natal-chart.js';
import { computeHouses } from '../houses.js';
import { computeAspects } from '../aspects.js';
import { computeAllPlanets } from '../planets.js';
import type { PlanetPosition } from '@oath/shared/types/natal-chart.js';

// ============================================
// 輔助工具
// ============================================

function utc(year: number, month: number, day: number, hour = 0, min = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, min, 0));
}

const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;

// ============================================
// 1. 行星位置測試
// ============================================

describe('computeAllPlanets', () => {
  it('should compute 10 planet positions', () => {
    const houses = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);
    const planets = computeAllPlanets(utc(2024, 3, 20, 12, 0), houses.cusps);

    expect(planets).toHaveLength(10);

    const planetNames = planets.map(p => p.planet);
    expect(planetNames).toContain('sun');
    expect(planetNames).toContain('moon');
    expect(planetNames).toContain('mercury');
    expect(planetNames).toContain('venus');
    expect(planetNames).toContain('mars');
    expect(planetNames).toContain('jupiter');
    expect(planetNames).toContain('saturn');
    expect(planetNames).toContain('uranus');
    expect(planetNames).toContain('neptune');
    expect(planetNames).toContain('pluto');
  });

  it('should place Sun in Pisces/Aries around March equinox', () => {
    // 2024年3月20日 — 春分附近，太陽在雙魚末 / 牡羊初
    const houses = computeHouses(utc(2024, 3, 20, 3, 6), 25.033, 121.565);
    const planets = computeAllPlanets(utc(2024, 3, 20, 3, 6), houses.cusps);
    const sun = planets.find(p => p.planet === 'sun')!;

    // 春分太陽在 ~0° Aries 或 ~29° Pisces
    expect(sun.degree).toBeGreaterThan(355);
    // 或者小於 5
    // 因為春分太陽在 0° Aries = 360°/0°
    // 容許 ±5°
    const isNearEquinox = sun.degree > 355 || sun.degree < 5;
    expect(isNearEquinox).toBe(true);
  });

  it('should place Sun in Cancer around summer solstice', () => {
    // 2024年6月21日 — 夏至，太陽在巨蟹初
    const houses = computeHouses(utc(2024, 6, 21, 12, 0), 25.033, 121.565);
    const planets = computeAllPlanets(utc(2024, 6, 21, 12, 0), houses.cusps);
    const sun = planets.find(p => p.planet === 'sun')!;

    // 夏至太陽在 ~90° (Cancer 0°)
    expect(sun.degree).toBeGreaterThan(85);
    expect(sun.degree).toBeLessThan(95);
    expect(sun.sign).toBe('cancer');
  });

  it('should have Sun and Moon never retrograde', () => {
    const houses = computeHouses(utc(2024, 6, 1, 12, 0), 25.033, 121.565);
    const planets = computeAllPlanets(utc(2024, 6, 1, 12, 0), houses.cusps);

    const sun = planets.find(p => p.planet === 'sun')!;
    const moon = planets.find(p => p.planet === 'moon')!;

    expect(sun.isRetrograde).toBe(false);
    expect(moon.isRetrograde).toBe(false);
  });

  it('should have valid planet properties', () => {
    const houses = computeHouses(utc(2024, 1, 15, 12, 0), 25.033, 121.565);
    const planets = computeAllPlanets(utc(2024, 1, 15, 12, 0), houses.cusps);

    for (const planet of planets) {
      // degree 在 0-360
      expect(planet.degree).toBeGreaterThanOrEqual(0);
      expect(planet.degree).toBeLessThan(360);

      // signDegree 在 0-30
      expect(planet.signDegree).toBeGreaterThanOrEqual(0);
      expect(planet.signDegree).toBeLessThan(30);

      // sign 是合法星座
      expect(ZODIAC_SIGNS).toContain(planet.sign);

      // house 在 1-12
      expect(planet.house).toBeGreaterThanOrEqual(1);
      expect(planet.house).toBeLessThanOrEqual(12);

      // isRetrograde 是 boolean
      expect(typeof planet.isRetrograde).toBe('boolean');
    }
  });
});

// ============================================
// 2. 宮位計算測試
// ============================================

describe('computeHouses', () => {
  it('should return 12 house cusps', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);

    expect(result.cusps).toHaveLength(12);
    expect(typeof result.ascendantDegree).toBe('number');
    expect(typeof result.midheavenDegree).toBe('number');
  });

  it('should have ASC degree equal to cusp[0]', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);
    expect(result.ascendantDegree).toBeCloseTo(result.cusps[0]!, 2);
  });

  it('should have MC degree equal to cusp[9]', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);
    expect(result.midheavenDegree).toBeCloseTo(result.cusps[9]!, 2);
  });

  it('should have all cusps in range [0, 360)', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);

    for (const cusp of result.cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });

  it('should have 7th house cusp opposite to ASC', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), 25.033, 121.565);

    const asc = result.cusps[0]!;
    const dsc = result.cusps[6]!;

    // DSC 應在 ASC 的正對面（差 180°）
    let angularDiff = Math.abs(dsc - asc);
    if (angularDiff > 180) angularDiff = 360 - angularDiff;
    // angularDiff 應接近 180°
    expect(Math.abs(angularDiff - 180)).toBeLessThan(1);
  });

  it('should produce different results for different locations', () => {
    const date = utc(2024, 3, 20, 12, 0);

    const taipei = computeHouses(date, 25.033, 121.565);
    const london = computeHouses(date, 51.507, -0.127);
    const sydney = computeHouses(date, -33.868, 151.209);

    // 不同地點 ASC 應不同
    expect(taipei.ascendantDegree).not.toBeCloseTo(london.ascendantDegree, 0);
    expect(taipei.ascendantDegree).not.toBeCloseTo(sydney.ascendantDegree, 0);
  });

  it('should work for southern hemisphere (Sydney)', () => {
    const result = computeHouses(utc(2024, 3, 20, 12, 0), -33.868, 151.209);

    expect(result.cusps).toHaveLength(12);
    expect(result.ascendantDegree).toBeGreaterThanOrEqual(0);
    expect(result.ascendantDegree).toBeLessThan(360);
  });
});

// ============================================
// 3. 相位計算測試
// ============================================

describe('computeAspects', () => {
  it('should detect conjunction (0°)', () => {
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 10, signDegree: 10, house: 1, isRetrograde: false },
      { planet: 'moon', sign: 'aries', degree: 13, signDegree: 13, house: 1, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    expect(aspects.length).toBeGreaterThanOrEqual(1);

    const conjunction = aspects.find(a => a.type === 'conjunction');
    expect(conjunction).toBeDefined();
    expect(conjunction!.planet1).toBe('sun');
    expect(conjunction!.planet2).toBe('moon');
    expect(conjunction!.orb).toBeLessThanOrEqual(8);
  });

  it('should detect opposition (180°)', () => {
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 10, signDegree: 10, house: 1, isRetrograde: false },
      { planet: 'saturn', sign: 'libra', degree: 192, signDegree: 12, house: 7, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    const opposition = aspects.find(a => a.type === 'opposition');
    expect(opposition).toBeDefined();
  });

  it('should detect trine (120°)', () => {
    const positions: PlanetPosition[] = [
      { planet: 'venus', sign: 'aries', degree: 15, signDegree: 15, house: 1, isRetrograde: false },
      { planet: 'jupiter', sign: 'leo', degree: 135, signDegree: 15, house: 5, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    const trine = aspects.find(a => a.type === 'trine');
    expect(trine).toBeDefined();
  });

  it('should detect square (90°)', () => {
    const positions: PlanetPosition[] = [
      { planet: 'mars', sign: 'aries', degree: 10, signDegree: 10, house: 1, isRetrograde: false },
      { planet: 'saturn', sign: 'cancer', degree: 100, signDegree: 10, house: 4, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    const square = aspects.find(a => a.type === 'square');
    expect(square).toBeDefined();
  });

  it('should detect sextile (60°)', () => {
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 15, signDegree: 15, house: 1, isRetrograde: false },
      { planet: 'moon', sign: 'gemini', degree: 75, signDegree: 15, house: 3, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    const sextile = aspects.find(a => a.type === 'sextile');
    expect(sextile).toBeDefined();
  });

  it('should not detect aspects beyond orb', () => {
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 10, signDegree: 10, house: 1, isRetrograde: false },
      { planet: 'moon', sign: 'taurus', degree: 45, signDegree: 15, house: 2, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    // 35° 距離 — 不符合任何主要相位
    expect(aspects).toHaveLength(0);
  });

  it('should only match the strongest aspect per pair', () => {
    // 確保每對行星只返回一個相位
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 5, signDegree: 5, house: 1, isRetrograde: false },
      { planet: 'moon', sign: 'aries', degree: 7, signDegree: 7, house: 1, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);
    const sunMoonAspects = aspects.filter(
      a => (a.planet1 === 'sun' && a.planet2 === 'moon') ||
           (a.planet1 === 'moon' && a.planet2 === 'sun')
    );
    expect(sunMoonAspects).toHaveLength(1);
    expect(sunMoonAspects[0]!.type).toBe('conjunction');
  });

  it('should have valid aspect properties', () => {
    const positions: PlanetPosition[] = [
      { planet: 'sun', sign: 'aries', degree: 10, signDegree: 10, house: 1, isRetrograde: false },
      { planet: 'moon', sign: 'cancer', degree: 100, signDegree: 10, house: 4, isRetrograde: false },
    ];

    const aspects = computeAspects(positions);

    for (const aspect of aspects) {
      expect(typeof aspect.angle).toBe('number');
      expect(typeof aspect.orb).toBe('number');
      expect(typeof aspect.isApplying).toBe('boolean');
      expect(aspect.angle).toBeGreaterThanOrEqual(0);
      expect(aspect.angle).toBeLessThanOrEqual(180);
    }
  });
});

// ============================================
// 4. 完整命盤測試
// ============================================

describe('computeNatalChart', () => {
  it('should return complete astrology data for Taipei', () => {
    const result = computeNatalChart({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      latitude: 25.033,
      longitude: 121.565,
    });

    expect(result.sun).toBeDefined();
    expect(result.moon).toBeDefined();
    expect(result.ascendant).toBeDefined();
    expect(result.planets.length).toBeGreaterThanOrEqual(12); // 10 planets + ASC + MC
    expect(result.aspects).toBeDefined();
    expect(result.houseCusps).toHaveLength(12);
  });

  it('should have Sun in Taurus for May 20 birth', () => {
    const result = computeNatalChart({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      latitude: 25.033,
      longitude: 121.565,
    });

    expect(result.sun.sign).toBe('taurus');
  });

  it('should include ascendant and midheaven in planets array', () => {
    const result = computeNatalChart({
      birthDatetime: utc(2000, 1, 1, 12, 0),
      latitude: 25.033,
      longitude: 121.565,
    });

    const planetNames = result.planets.map(p => p.planet);
    expect(planetNames).toContain('ascendant');
    expect(planetNames).toContain('midheaven');
  });

  it('should have ascendant in house 1 and midheaven in house 10', () => {
    const result = computeNatalChart({
      birthDatetime: utc(2000, 1, 1, 12, 0),
      latitude: 25.033,
      longitude: 121.565,
    });

    expect(result.ascendant.house).toBe(1);

    const mc = result.planets.find(p => p.planet === 'midheaven');
    expect(mc).toBeDefined();
    expect(mc!.house).toBe(10);
  });

  it('should produce different charts for different times/locations', () => {
    const chart1 = computeNatalChart({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      latitude: 25.033,
      longitude: 121.565,
    });

    const chart2 = computeNatalChart({
      birthDatetime: utc(1990, 5, 20, 20, 0), // 12 小時後
      latitude: 40.7128,
      longitude: -74.006, // 紐約
    });

    // ASC 應不同（不同時間、不同地點）
    expect(chart1.ascendant.degree).not.toBeCloseTo(chart2.ascendant.degree, 0);
  });
});

// ============================================
// 5. 南半球測試
// ============================================

describe('computeNatalChart — 南半球', () => {
  it('should work correctly for Sydney', () => {
    const result = computeNatalChart({
      birthDatetime: utc(2024, 3, 20, 2, 0), // 雪梨 12:00 AEDT (UTC+11)
      latitude: -33.868,
      longitude: 151.209,
    });

    expect(result.sun).toBeDefined();
    expect(result.moon).toBeDefined();
    expect(result.ascendant).toBeDefined();
    expect(result.houseCusps).toHaveLength(12);

    // 所有宮位度數有效
    for (const cusp of result.houseCusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });
});

// ============================================
// 6. Fuzz Test
// ============================================

describe('computeNatalChart — Fuzz Test', () => {
  it('should not crash for 50 random inputs', () => {
    for (let i = 0; i < 50; i++) {
      const year = 1940 + Math.floor(Math.random() * 85);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      const hour = Math.floor(Math.random() * 24);
      const latitude = -90 + Math.random() * 170; // -90 to 80（避免極地）
      const longitude = -180 + Math.random() * 360;

      expect(() => {
        computeNatalChart({
          birthDatetime: utc(year, month, day, hour),
          latitude,
          longitude,
        });
      }).not.toThrow();
    }
  });
});
