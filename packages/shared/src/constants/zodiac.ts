/**
 * 黃道十二星座常數
 */

import type { ZodiacSign } from '../types/natal-chart.js';

export interface ZodiacInfo {
  readonly sign: ZodiacSign;
  readonly symbol: string;
  readonly element: 'fire' | 'earth' | 'air' | 'water';
  readonly modality: 'cardinal' | 'fixed' | 'mutable';
  readonly dateRange: { readonly start: string; readonly end: string };
}

export const ZODIAC_SIGNS: readonly ZodiacInfo[] = [
  { sign: 'aries', symbol: '\u2648', element: 'fire', modality: 'cardinal', dateRange: { start: '03-21', end: '04-19' } },
  { sign: 'taurus', symbol: '\u2649', element: 'earth', modality: 'fixed', dateRange: { start: '04-20', end: '05-20' } },
  { sign: 'gemini', symbol: '\u264A', element: 'air', modality: 'mutable', dateRange: { start: '05-21', end: '06-20' } },
  { sign: 'cancer', symbol: '\u264B', element: 'water', modality: 'cardinal', dateRange: { start: '06-21', end: '07-22' } },
  { sign: 'leo', symbol: '\u264C', element: 'fire', modality: 'fixed', dateRange: { start: '07-23', end: '08-22' } },
  { sign: 'virgo', symbol: '\u264D', element: 'earth', modality: 'mutable', dateRange: { start: '08-23', end: '09-22' } },
  { sign: 'libra', symbol: '\u264E', element: 'air', modality: 'cardinal', dateRange: { start: '09-23', end: '10-22' } },
  { sign: 'scorpio', symbol: '\u264F', element: 'water', modality: 'fixed', dateRange: { start: '10-23', end: '11-21' } },
  { sign: 'sagittarius', symbol: '\u2650', element: 'fire', modality: 'mutable', dateRange: { start: '11-22', end: '12-21' } },
  { sign: 'capricorn', symbol: '\u2651', element: 'earth', modality: 'cardinal', dateRange: { start: '12-22', end: '01-19' } },
  { sign: 'aquarius', symbol: '\u2652', element: 'air', modality: 'fixed', dateRange: { start: '01-20', end: '02-18' } },
  { sign: 'pisces', symbol: '\u2653', element: 'water', modality: 'mutable', dateRange: { start: '02-19', end: '03-20' } },
] as const;
