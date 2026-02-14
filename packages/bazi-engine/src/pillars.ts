/**
 * 四柱排盤 — 公開 API
 */

import type { BaziData } from '@oath/shared/types/index.js';
import type { BirthTimePrecision } from '@oath/shared/types/user.js';
import { computeBaziFromLunar } from './lunar-adapter.js';

export interface ComputeBaziInput {
  /** UTC 出生時間 */
  readonly birthDatetime: Date;
  /** 出生地經度（東經為正，用於真太陽時） */
  readonly longitude: number;
  /** 性別 */
  readonly gender: 'male' | 'female';
  /** 出生時間精確度 */
  readonly timePrecision: BirthTimePrecision;
}

/**
 * 計算八字四柱
 *
 * - 精確時間 → 使用真太陽時計算時柱
 * - 近似時辰 → 直接使用，不做真太陽時修正
 * - 時間不詳 → 時柱為 null
 */
export function computeBazi(input: ComputeBaziInput): BaziData {
  const useTrueSolarTime = input.timePrecision === 'exact';

  return computeBaziFromLunar({
    birthDatetime: input.birthDatetime,
    longitude: input.longitude,
    genderCode: input.gender === 'male' ? 0 : 1,
    timePrecision: input.timePrecision,
    useTrueSolarTime,
  });
}
