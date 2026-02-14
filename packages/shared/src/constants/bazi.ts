/**
 * 八字命理常數 — 天干地支、五行對應
 */

import type { HeavenlyStem, EarthlyBranch, WuXing } from '../types/natal-chart.js';

export interface StemInfo {
  readonly stem: HeavenlyStem;
  /** 中文天干 */
  readonly chinese: string;
  /** 對應五行 */
  readonly element: WuXing;
  /** 陰陽（true = 陽） */
  readonly isYang: boolean;
}

export interface BranchInfo {
  readonly branch: EarthlyBranch;
  /** 中文地支 */
  readonly chinese: string;
  /** 生肖 */
  readonly zodiacAnimal: string;
  /** 對應五行 */
  readonly element: WuXing;
  /** 陰陽（true = 陽） */
  readonly isYang: boolean;
  /** 藏干 */
  readonly hiddenStems: readonly HeavenlyStem[];
  /** 對應時辰（24 小時制起始） */
  readonly hourStart: number;
}

/** 十天干 */
export const HEAVENLY_STEMS: readonly StemInfo[] = [
  { stem: 'jia', chinese: '甲', element: 'wood', isYang: true },
  { stem: 'yi', chinese: '乙', element: 'wood', isYang: false },
  { stem: 'bing', chinese: '丙', element: 'fire', isYang: true },
  { stem: 'ding', chinese: '丁', element: 'fire', isYang: false },
  { stem: 'wu', chinese: '戊', element: 'earth', isYang: true },
  { stem: 'ji', chinese: '己', element: 'earth', isYang: false },
  { stem: 'geng', chinese: '庚', element: 'metal', isYang: true },
  { stem: 'xin', chinese: '辛', element: 'metal', isYang: false },
  { stem: 'ren', chinese: '壬', element: 'water', isYang: true },
  { stem: 'gui', chinese: '癸', element: 'water', isYang: false },
] as const;

/** 十二地支 */
export const EARTHLY_BRANCHES: readonly BranchInfo[] = [
  { branch: 'zi', chinese: '子', zodiacAnimal: '鼠', element: 'water', isYang: true, hiddenStems: ['gui'], hourStart: 23 },
  { branch: 'chou', chinese: '丑', zodiacAnimal: '牛', element: 'earth', isYang: false, hiddenStems: ['ji', 'gui', 'xin'], hourStart: 1 },
  { branch: 'yin', chinese: '寅', zodiacAnimal: '虎', element: 'wood', isYang: true, hiddenStems: ['jia', 'bing', 'wu'], hourStart: 3 },
  { branch: 'mao', chinese: '卯', zodiacAnimal: '兔', element: 'wood', isYang: false, hiddenStems: ['yi'], hourStart: 5 },
  { branch: 'chen', chinese: '辰', zodiacAnimal: '龍', element: 'earth', isYang: true, hiddenStems: ['wu', 'yi', 'gui'], hourStart: 7 },
  { branch: 'si', chinese: '巳', zodiacAnimal: '蛇', element: 'fire', isYang: false, hiddenStems: ['bing', 'wu', 'geng'], hourStart: 9 },
  { branch: 'wu', chinese: '午', zodiacAnimal: '馬', element: 'fire', isYang: true, hiddenStems: ['ding', 'ji'], hourStart: 11 },
  { branch: 'wei', chinese: '未', zodiacAnimal: '羊', element: 'earth', isYang: false, hiddenStems: ['ji', 'ding', 'yi'], hourStart: 13 },
  { branch: 'shen', chinese: '申', zodiacAnimal: '猴', element: 'metal', isYang: true, hiddenStems: ['geng', 'ren', 'wu'], hourStart: 15 },
  { branch: 'you', chinese: '酉', zodiacAnimal: '雞', element: 'metal', isYang: false, hiddenStems: ['xin'], hourStart: 17 },
  { branch: 'xu', chinese: '戌', zodiacAnimal: '狗', element: 'earth', isYang: true, hiddenStems: ['wu', 'xin', 'ding'], hourStart: 19 },
  { branch: 'hai', chinese: '亥', zodiacAnimal: '豬', element: 'water', isYang: false, hiddenStems: ['ren', 'jia'], hourStart: 21 },
] as const;

/** 五行相生相剋 */
export const WUXING_RELATIONS = {
  generates: {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood',
  } as const satisfies Record<WuXing, WuXing>,

  overcomes: {
    wood: 'earth',
    fire: 'metal',
    earth: 'water',
    metal: 'wood',
    water: 'fire',
  } as const satisfies Record<WuXing, WuXing>,
} as const;
