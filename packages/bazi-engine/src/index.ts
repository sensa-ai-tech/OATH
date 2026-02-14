/**
 * 八字命理引擎 — 僅伺服器端使用
 *
 * 基於 lunar-typescript (MIT) 實作
 * - lunar-adapter.ts: lunar-typescript → @oath/shared 型別轉換
 * - true-solar-time.ts: Spencer 1971 均時差公式
 * - pillars.ts: 四柱排盤公開 API
 */

export const BAZI_ENGINE_VERSION = '1.0.0';

export { computeBazi } from './pillars.js';
export type { ComputeBaziInput } from './pillars.js';
export { calculateTrueSolarTime } from './true-solar-time.js';
export { computeBaziFromLunar } from './lunar-adapter.js';
export type { BaziComputeInput } from './lunar-adapter.js';

// Re-export types for convenience
export type {
  BaziData,
  Pillar,
  HeavenlyStem,
  EarthlyBranch,
  WuXing,
  TenGod,
  LuckPillar,
  DayMasterAnalysis,
} from '@oath/shared/types/natal-chart.js';
