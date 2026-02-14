/**
 * 相位計算
 */

import type { AspectData, AspectType, PlanetPosition } from '@oath/shared/types/natal-chart.js';
import { ASPECT_ORBS } from '@oath/shared/constants/engine.js';

interface AspectDef {
  readonly type: AspectType;
  readonly angle: number;
  readonly orb: number;
}

const ASPECT_DEFS: readonly AspectDef[] = [
  { type: 'conjunction', angle: 0, orb: ASPECT_ORBS.conjunction },
  { type: 'sextile', angle: 60, orb: ASPECT_ORBS.sextile },
  { type: 'square', angle: 90, orb: ASPECT_ORBS.square },
  { type: 'trine', angle: 120, orb: ASPECT_ORBS.trine },
  { type: 'opposition', angle: 180, orb: ASPECT_ORBS.opposition },
];

/**
 * 計算兩個行星之間的角距
 */
function angularDistance(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * 計算所有行星之間的相位
 */
export function computeAspects(
  positions: readonly PlanetPosition[],
): AspectData[] {
  const aspects: AspectData[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i]!;
      const p2 = positions[j]!;
      const distance = angularDistance(p1.degree, p2.degree);

      for (const aspectDef of ASPECT_DEFS) {
        const orb = Math.abs(distance - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          // 判斷 applying vs separating
          // 簡化：目前以容許度大小判斷
          const isApplying = orb < aspectDef.orb / 2;

          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: aspectDef.type,
            angle: distance,
            orb,
            isApplying,
          });
          break; // 每對行星只匹配最強的相位
        }
      }
    }
  }

  return aspects;
}
