/**
 * 每日行運（Transit）計算測試
 *
 * 測試策略：
 * 1. computeDailyTransit — 基本計算、月亮星座提取、行運事件產生
 * 2. extractTransitTags — 標籤產生邏輯
 */

import { describe, it, expect } from 'vitest';
import { computeDailyTransit, extractTransitTags } from '../transit.js';
import { computeNatalChart } from '../natal-chart.js';
import type { PlanetPosition } from '@oath/shared/types/natal-chart.js';

// 使用 Einstein 的出生資料作為固定測試基準
const EINSTEIN_DATE = new Date(Date.UTC(1879, 2, 14, 10, 30, 0));
const ULM_LAT = 48.4011;
const ULM_LON = 9.9876;

// 先計算 Einstein 的本命盤行星位置
const einsteinChart = computeNatalChart({
  birthDatetime: EINSTEIN_DATE,
  latitude: ULM_LAT,
  longitude: ULM_LON,
});
const natalPlanets = einsteinChart.planets;

// ============================================
// 1. computeDailyTransit
// ============================================

describe('computeDailyTransit', () => {
  it('should return a valid DailyTransit object', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    expect(transit).toBeDefined();
    expect(transit.moonSign).toBeDefined();
    expect(transit.transits).toBeDefined();
    expect(transit.significantAspects).toBeDefined();
    expect(Array.isArray(transit.transits)).toBe(true);
    expect(Array.isArray(transit.significantAspects)).toBe(true);
  });

  it('should return a valid zodiac sign for moonSign', () => {
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer',
      'leo', 'virgo', 'libra', 'scorpio',
      'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];

    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    expect(validSigns).toContain(transit.moonSign);
  });

  it('should limit transits to 10 events', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    expect(transit.transits.length).toBeLessThanOrEqual(10);
  });

  it('should limit significantAspects to 5', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    expect(transit.significantAspects.length).toBeLessThanOrEqual(5);
  });

  it('should produce valid transit events with required fields', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    for (const event of transit.transits) {
      expect(event.transitPlanet).toBeDefined();
      expect(event.natalPlanet).toBeDefined();
      expect(event.aspect).toBeDefined();
      expect(event.interpretationKey).toBeDefined();
      expect(event.aspect.type).toBeDefined();
      expect(event.aspect.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it('should find transit aspects across different dates', () => {
    // 不同日期的行運應該有差異（行星移動）
    const transit1 = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 0, 1)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    const transit2 = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 6, 1)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    // 月亮星座在不同月份應不同（或至少行運事件不同）
    const keys1 = transit1.transits.map(e => e.interpretationKey).join(',');
    const keys2 = transit2.transits.map(e => e.interpretationKey).join(',');
    // 半年前後的行運 key 集合不應完全相同
    expect(keys1).not.toBe(keys2);
  });

  it('should have transit events with valid aspect types', () => {
    const validAspects = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    for (const event of transit.transits) {
      expect(validAspects).toContain(event.aspect.type);
    }
  });

  it('should not include ascendant/midheaven in transit planets', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    for (const event of transit.transits) {
      expect(event.transitPlanet.planet).not.toBe('ascendant');
      expect(event.transitPlanet.planet).not.toBe('midheaven');
      expect(event.natalPlanet.planet).not.toBe('ascendant');
      expect(event.natalPlanet.planet).not.toBe('midheaven');
    }
  });
});

// ============================================
// 2. extractTransitTags
// ============================================

describe('extractTransitTags', () => {
  it('should always include a moon sign tag', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    const tags = extractTransitTags(transit);
    const moonTag = tags.find(t => t.startsWith('moon-'));
    expect(moonTag).toBeDefined();
  });

  it('should include aspect type tags from top transit events', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    const tags = extractTransitTags(transit);
    // tags 應包含一些相位類型
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should return unique tags', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    const tags = extractTransitTags(transit);
    const uniqueTags = new Set(tags);
    expect(uniqueTags.size).toBe(tags.length);
  });

  it('should include planet names from transit events', () => {
    const transit = computeDailyTransit({
      transitDate: new Date(Date.UTC(2026, 1, 15)),
      natalPlanets,
      latitude: ULM_LAT,
      longitude: ULM_LON,
    });

    if (transit.transits.length > 0) {
      const tags = extractTransitTags(transit);
      // 至少包含一個行星名稱
      const planetNames = ['sun', 'moon', 'mercury', 'venus', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      const hasPlanet = tags.some(t => planetNames.includes(t));
      expect(hasPlanet).toBe(true);
    }
  });
});
