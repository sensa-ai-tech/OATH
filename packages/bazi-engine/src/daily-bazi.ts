/**
 * 流日八字分析
 *
 * 計算特定日期的天干地支，並分析與使用者日主的關係
 */

import { Solar } from 'lunar-typescript';
import type {
  HeavenlyStem,
  EarthlyBranch,
  WuXing,
  TenGod,
  BaziData,
} from '@oath/shared/types/natal-chart.js';
import type { DailyBaziAnalysis } from '@oath/shared/types/daily-fortune.js';

/** 天干中文 → 英文 */
const STEM_MAP: Record<string, HeavenlyStem> = {
  '甲': 'jia', '乙': 'yi', '丙': 'bing', '丁': 'ding', '戊': 'wu',
  '己': 'ji', '庚': 'geng', '辛': 'xin', '壬': 'ren', '癸': 'gui',
};

/** 地支中文 → 英文 */
const BRANCH_MAP: Record<string, EarthlyBranch> = {
  '子': 'zi', '丑': 'chou', '寅': 'yin', '卯': 'mao',
  '辰': 'chen', '巳': 'si', '午': 'wu', '未': 'wei',
  '申': 'shen', '酉': 'you', '戌': 'xu', '亥': 'hai',
};

/** 天干對應五行 */
const STEM_ELEMENT: Record<HeavenlyStem, WuXing> = {
  jia: 'wood', yi: 'wood', bing: 'fire', ding: 'fire', wu: 'earth',
  ji: 'earth', geng: 'metal', xin: 'metal', ren: 'water', gui: 'water',
};

/** 十神計算（根據日主天干和流日天干的關係） */
const TEN_GOD_TABLE: Record<string, TenGod> = {
  // 同我：比肩（同陰陽）、劫財（異陰陽）
  // 我生：食神（同陰陽）、傷官（異陰陽）
  // 我剋：正財（異陰陽）、偏財（同陰陽）
  // 剋我：正官（異陰陽）、七殺（同陰陽）
  // 生我：正印（異陰陽）、偏印（同陰陽）
};

/** 天干是否為陽干 */
const IS_YANG: Record<HeavenlyStem, boolean> = {
  jia: true, yi: false, bing: true, ding: false, wu: true,
  ji: false, geng: true, xin: false, ren: true, gui: false,
};

/** 五行相生關係 */
const GENERATES: Record<WuXing, WuXing> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};

/** 五行相剋關係 */
const OVERCOMES: Record<WuXing, WuXing> = {
  wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire',
};

/**
 * 計算流日天干與日主天干的十神關係
 */
function computeTenGodRelation(dayMaster: HeavenlyStem, dayStem: HeavenlyStem): TenGod {
  const masterElement = STEM_ELEMENT[dayMaster];
  const stemElement = STEM_ELEMENT[dayStem];
  const samePolarity = IS_YANG[dayMaster] === IS_YANG[dayStem];

  // 同我
  if (masterElement === stemElement) {
    return samePolarity ? 'bi_jian' : 'jie_cai';
  }

  // 我生
  if (GENERATES[masterElement] === stemElement) {
    return samePolarity ? 'shi_shen' : 'shang_guan';
  }

  // 我剋
  if (OVERCOMES[masterElement] === stemElement) {
    return samePolarity ? 'pian_cai' : 'zheng_cai';
  }

  // 剋我
  if (OVERCOMES[stemElement] === masterElement) {
    return samePolarity ? 'qi_sha' : 'zheng_guan';
  }

  // 生我
  if (GENERATES[stemElement] === masterElement) {
    return samePolarity ? 'pian_yin' : 'zheng_yin';
  }

  // Fallback（不應到達）
  return 'bi_jian';
}

/**
 * 生成流日解讀鍵值
 */
function makeInterpretationKey(
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch,
  tenGod: TenGod,
  dayElement: WuXing,
): string {
  return `daily-${dayElement}-${tenGod}`;
}

export interface ComputeDailyBaziInput {
  /** 要計算的日期（UTC） */
  readonly date: Date;
  /** 使用者的八字資料（用於取得日主） */
  readonly baziData: BaziData;
}

/**
 * 計算流日八字分析
 */
export function computeDailyBazi(input: ComputeDailyBaziInput): DailyBaziAnalysis {
  const { date, baziData } = input;

  // 用 lunar-typescript 取得流日天干地支
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  const dayGanCn = lunar.getDayGan();
  const dayZhiCn = lunar.getDayZhi();

  const dayStem = STEM_MAP[dayGanCn] ?? 'jia';
  const dayBranch = BRANCH_MAP[dayZhiCn] ?? 'zi';
  const dayElement = STEM_ELEMENT[dayStem];

  // 計算流日天干與日主的十神關係
  const dayMaster = baziData.dayMasterAnalysis.dayMaster;
  const tenGod = computeTenGodRelation(dayMaster, dayStem);

  // 十神的中文名稱映射（用於模板匹配）
  const tenGodNames: Record<TenGod, string> = {
    bi_jian: '比肩', jie_cai: '劫財',
    shi_shen: '食神', shang_guan: '傷官',
    zheng_cai: '正財', pian_cai: '偏財',
    zheng_guan: '正官', qi_sha: '七殺',
    zheng_yin: '正印', pian_yin: '偏印',
  };

  return {
    dayStem,
    dayBranch,
    dayElement,
    dayRelation: tenGodNames[tenGod],
    interpretationKey: makeInterpretationKey(dayStem, dayBranch, tenGod, dayElement),
  };
}

/**
 * 提取流日八字的模板匹配標籤
 */
export function extractBaziTags(analysis: DailyBaziAnalysis, baziData: BaziData): string[] {
  const tags: string[] = [];

  // 流日五行
  tags.push(analysis.dayElement);

  // 流日十神（十神 ID 格式）
  const tenGodMap: Record<string, string> = {
    '比肩': 'bi_jian', '劫財': 'jie_cai',
    '食神': 'shi_shen', '傷官': 'shang_guan',
    '正財': 'zheng_cai', '偏財': 'pian_cai',
    '正官': 'zheng_guan', '七殺': 'qi_sha',
    '正印': 'zheng_yin', '偏印': 'pian_yin',
  };
  const tenGodTag = tenGodMap[analysis.dayRelation];
  if (tenGodTag) tags.push(tenGodTag);

  // 日主強弱標籤
  tags.push(`daymaster-${baziData.dayMasterAnalysis.strength}`);

  // 流日五行與日主的生剋關係標籤
  const masterElement = baziData.dayMasterAnalysis.element;
  if (baziData.dayMasterAnalysis.favorableElements.includes(analysis.dayElement)) {
    tags.push('favorable');
  } else if (baziData.dayMasterAnalysis.unfavorableElements.includes(analysis.dayElement)) {
    tags.push('challenge');
  }

  return tags;
}
