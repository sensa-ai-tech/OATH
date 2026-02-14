/**
 * 西洋占星引擎 — 僅伺服器端使用
 *
 * 基於 astronomy-engine (MIT) 實作
 * - planets.ts: 行星黃經計算
 * - houses.ts: Placidus 宮位計算
 * - aspects.ts: 相位計算
 * - natal-chart.ts: 聚合公開 API
 */

export const ASTROLOGY_ENGINE_VERSION = '1.0.0';

export { computeNatalChart } from './natal-chart.js';
export type { ComputeAstrologyInput } from './natal-chart.js';
export { computeHouses } from './houses.js';
export type { HouseData } from './houses.js';
export { computeAllPlanets } from './planets.js';
export { computeAspects } from './aspects.js';

// Re-export types for convenience
export type {
  AstrologyData,
  PlanetPosition,
  AspectData,
  ZodiacSign,
  Planet,
  AspectType,
} from '@oath/shared/types/natal-chart.js';
