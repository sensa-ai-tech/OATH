/**
 * 命盤相關型別定義（中西合璧）
 */

// ============================================
// 西洋占星
// ============================================

/** 黃道十二星座 */
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/** 行星 */
export type Planet =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'ascendant' | 'midheaven';

/** 相位類型 */
export type AspectType =
  | 'conjunction'   // 合相 0°
  | 'sextile'       // 六分相 60°
  | 'square'        // 四分相 90°
  | 'trine'         // 三分相 120°
  | 'opposition';   // 對分相 180°

/** 行星位置資料 */
export interface PlanetPosition {
  readonly planet: Planet;
  /** 所在星座 */
  readonly sign: ZodiacSign;
  /** 精確度數（0-360） */
  readonly degree: number;
  /** 星座內度數（0-30） */
  readonly signDegree: number;
  /** 所在宮位（1-12） */
  readonly house: number;
  /** 是否逆行 */
  readonly isRetrograde: boolean;
}

/** 相位資料 */
export interface AspectData {
  readonly planet1: Planet;
  readonly planet2: Planet;
  readonly type: AspectType;
  /** 精確角度 */
  readonly angle: number;
  /** 容許度內的偏差 */
  readonly orb: number;
  /** 是否為入相位（approaching） */
  readonly isApplying: boolean;
}

/** 西洋占星命盤資料 */
export interface AstrologyData {
  readonly sun: PlanetPosition;
  readonly moon: PlanetPosition;
  readonly ascendant: PlanetPosition;
  readonly planets: readonly PlanetPosition[];
  readonly aspects: readonly AspectData[];
  /** 各宮位起始度數 */
  readonly houseCusps: readonly number[];
}

// ============================================
// 八字命理
// ============================================

/** 天干 */
export type HeavenlyStem =
  | 'jia' | 'yi' | 'bing' | 'ding' | 'wu'
  | 'ji' | 'geng' | 'xin' | 'ren' | 'gui';

/** 地支 */
export type EarthlyBranch =
  | 'zi' | 'chou' | 'yin' | 'mao' | 'chen' | 'si'
  | 'wu' | 'wei' | 'shen' | 'you' | 'xu' | 'hai';

/** 五行 */
export type WuXing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** 十神 */
export type TenGod =
  | 'bi_jian'       // 比肩
  | 'jie_cai'       // 劫財
  | 'shi_shen'      // 食神
  | 'shang_guan'    // 傷官
  | 'zheng_cai'     // 正財
  | 'pian_cai'      // 偏財
  | 'zheng_guan'    // 正官
  | 'qi_sha'        // 七殺
  | 'zheng_yin'     // 正印
  | 'pian_yin';     // 偏印

/** 四柱中的一柱 */
export interface Pillar {
  /** 天干 */
  readonly heavenlyStem: HeavenlyStem;
  /** 地支 */
  readonly earthlyBranch: EarthlyBranch;
  /** 天干五行 */
  readonly stemElement: WuXing;
  /** 地支五行 */
  readonly branchElement: WuXing;
  /** 天干十神（相對於日主） */
  readonly tenGod?: TenGod;
  /** 地支藏干 */
  readonly hiddenStems: readonly HeavenlyStem[];
}

/** 大運資料 */
export interface LuckPillar {
  readonly heavenlyStem: HeavenlyStem;
  readonly earthlyBranch: EarthlyBranch;
  /** 起運年齡 */
  readonly startAge: number;
  /** 結束年齡 */
  readonly endAge: number;
}

/** 日主強弱分析 */
export interface DayMasterAnalysis {
  /** 日主天干 */
  readonly dayMaster: HeavenlyStem;
  /** 日主五行 */
  readonly element: WuXing;
  /** 強度評估 */
  readonly strength: 'strong' | 'moderate' | 'weak';
  /** 喜用神 */
  readonly favorableElements: readonly WuXing[];
  /** 忌神 */
  readonly unfavorableElements: readonly WuXing[];
}

/** 八字命盤資料 */
export interface BaziData {
  readonly yearPillar: Pillar;
  readonly monthPillar: Pillar;
  readonly dayPillar: Pillar;
  /** 時柱（birth_time_precision = 'unknown' 時為 null） */
  readonly hourPillar: Pillar | null;
  /** 大運列表 */
  readonly luckPillars: readonly LuckPillar[];
  /** 日主分析 */
  readonly dayMasterAnalysis: DayMasterAnalysis;
  /** 是否使用真太陽時計算 */
  readonly usedTrueSolarTime: boolean;
  /** 出生時間精確度標記 */
  readonly timePrecision: 'exact' | 'approximate' | 'unknown';
}

// ============================================
// 合併命盤
// ============================================

/** 完整命盤（中西合璧） */
export interface NatalChart {
  readonly id: string;
  readonly userId: string;
  readonly astrologyData: AstrologyData;
  readonly baziData: BaziData;
  /** 排盤引擎版本 */
  readonly engineVersion: string;
  readonly computedAt: string;
}
