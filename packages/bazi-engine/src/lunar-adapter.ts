/**
 * lunar-typescript 封裝層
 *
 * 將 lunar-typescript 的中文 API 轉譯為 @oath/shared 定義的英文型別
 */

import { Solar, LunarUtil } from 'lunar-typescript';
import type {
  HeavenlyStem,
  EarthlyBranch,
  WuXing,
  TenGod,
  Pillar,
  LuckPillar,
  DayMasterAnalysis,
  BaziData,
} from '@oath/shared/types/natal-chart.js';
import type { BirthTimePrecision } from '@oath/shared/types/user.js';
import { calculateTrueSolarTime } from './true-solar-time.js';

// ============================================
// 中文 → 英文對照表
// ============================================

const STEM_MAP: Record<string, HeavenlyStem> = {
  '甲': 'jia', '乙': 'yi', '丙': 'bing', '丁': 'ding', '戊': 'wu',
  '己': 'ji', '庚': 'geng', '辛': 'xin', '壬': 'ren', '癸': 'gui',
};

const BRANCH_MAP: Record<string, EarthlyBranch> = {
  '子': 'zi', '丑': 'chou', '寅': 'yin', '卯': 'mao', '辰': 'chen', '巳': 'si',
  '午': 'wu', '未': 'wei', '申': 'shen', '酉': 'you', '戌': 'xu', '亥': 'hai',
};

const ELEMENT_MAP: Record<string, WuXing> = {
  '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water',
};

const TEN_GOD_MAP: Record<string, TenGod> = {
  // 繁體中文
  '比肩': 'bi_jian', '劫財': 'jie_cai',
  '食神': 'shi_shen', '傷官': 'shang_guan',
  '正財': 'zheng_cai', '偏財': 'pian_cai',
  '正官': 'zheng_guan', '七殺': 'qi_sha',
  '正印': 'zheng_yin', '偏印': 'pian_yin',
  // 簡體中文（lunar-typescript 可能返回簡體）
  '劫财': 'jie_cai',
  '伤官': 'shang_guan',
  '正财': 'zheng_cai', '偏财': 'pian_cai',
  '七杀': 'qi_sha',
  // 日主 = 比肩（日柱天干對自己的十神就是比肩）
  '日主': 'bi_jian',
};

/** 天干對應五行 */
const STEM_ELEMENT: Record<string, WuXing> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

/** 地支對應五行 */
const BRANCH_ELEMENT: Record<string, WuXing> = {
  '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water',
};

// ============================================
// 長生十二運 → 日主強弱
// ============================================

/** 長生十二運 index → 強度 */
function getStrengthFromChangSheng(index: number): 'strong' | 'moderate' | 'weak' {
  // 帝旺(4), 臨官(3), 冠帶(2), 長生(0) = strong
  // 沐浴(1), 養(11), 墓(8), 胎(10) = moderate
  // 衰(5), 病(6), 死(7), 絕(9) = weak
  if ([4, 3, 2, 0].includes(index)) return 'strong';
  if ([1, 11, 8, 10].includes(index)) return 'moderate';
  return 'weak';
}

/**
 * 五行相生：生我者為印星（有利）
 * 五行同類：比劫（有利）
 */
function getFavorableElements(element: WuXing): readonly WuXing[] {
  const generates: Record<WuXing, WuXing> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
  };
  const generatedBy: Record<WuXing, WuXing> = {
    fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal', wood: 'water',
  };
  return [element, generatedBy[element]] as const;
}

function getUnfavorableElements(element: WuXing): readonly WuXing[] {
  const overcomes: Record<WuXing, WuXing> = {
    wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire',
  };
  const overcomedBy: Record<WuXing, WuXing> = {
    earth: 'wood', metal: 'fire', water: 'earth', wood: 'metal', fire: 'water',
  };
  return [overcomes[element], overcomedBy[element]] as const;
}

// ============================================
// 核心轉換函式
// ============================================

function mapStem(cn: string): HeavenlyStem {
  const mapped = STEM_MAP[cn];
  if (!mapped) throw new Error(`Unknown stem: ${cn}`);
  return mapped;
}

function mapBranch(cn: string): EarthlyBranch {
  const mapped = BRANCH_MAP[cn];
  if (!mapped) throw new Error(`Unknown branch: ${cn}`);
  return mapped;
}

function mapElement(cn: string): WuXing {
  const mapped = ELEMENT_MAP[cn];
  if (!mapped) throw new Error(`Unknown element: ${cn}`);
  return mapped;
}

function mapTenGod(cn: string): TenGod {
  const mapped = TEN_GOD_MAP[cn];
  if (!mapped) throw new Error(`Unknown ten god: ${cn}`);
  return mapped;
}

function stemToElement(cn: string): WuXing {
  const mapped = STEM_ELEMENT[cn];
  if (!mapped) throw new Error(`Unknown stem element: ${cn}`);
  return mapped;
}

function branchToElement(cn: string): WuXing {
  const mapped = BRANCH_ELEMENT[cn];
  if (!mapped) throw new Error(`Unknown branch element: ${cn}`);
  return mapped;
}

// ============================================
// 主函式
// ============================================

export interface BaziComputeInput {
  /** UTC 時間 */
  readonly birthDatetime: Date;
  /** 出生地經度（真太陽時用） */
  readonly longitude: number;
  /** 性別：0=男, 1=女 */
  readonly genderCode: 0 | 1;
  /** 出生時間精確度 */
  readonly timePrecision: BirthTimePrecision;
  /** 是否使用真太陽時 */
  readonly useTrueSolarTime: boolean;
}

/**
 * 使用 lunar-typescript 計算八字四柱
 */
export function computeBaziFromLunar(input: BaziComputeInput): BaziData {
  const { birthDatetime, genderCode, timePrecision, useTrueSolarTime, longitude } = input;

  // 1. 決定計算用的時間
  let computeDate = birthDatetime;

  if (useTrueSolarTime) {
    computeDate = calculateTrueSolarTime(birthDatetime, longitude);
  }

  // 2. 建立 Solar 物件
  const solar = Solar.fromYmdHms(
    computeDate.getUTCFullYear(),
    computeDate.getUTCMonth() + 1,
    computeDate.getUTCDate(),
    computeDate.getUTCHours(),
    computeDate.getUTCMinutes(),
    computeDate.getUTCSeconds(),
  );

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 3. 建立四柱
  function buildPillar(
    stemCn: string,
    branchCn: string,
    tenGodCn: string | null,
    hiddenStemsCn: string[],
  ): Pillar {
    return {
      heavenlyStem: mapStem(stemCn),
      earthlyBranch: mapBranch(branchCn),
      stemElement: stemToElement(stemCn),
      branchElement: branchToElement(branchCn),
      tenGod: tenGodCn ? mapTenGod(tenGodCn) : undefined,
      hiddenStems: hiddenStemsCn.map(mapStem),
    };
  }

  const yearPillar = buildPillar(
    eightChar.getYearGan(),
    eightChar.getYearZhi(),
    eightChar.getYearShiShenGan(),
    eightChar.getYearHideGan(),
  );

  const monthPillar = buildPillar(
    eightChar.getMonthGan(),
    eightChar.getMonthZhi(),
    eightChar.getMonthShiShenGan(),
    eightChar.getMonthHideGan(),
  );

  const dayPillar = buildPillar(
    eightChar.getDayGan(),
    eightChar.getDayZhi(),
    eightChar.getDayShiShenGan(), // 比肩
    eightChar.getDayHideGan(),
  );

  // 4. 時柱（精確度 unknown 時為 null）
  let hourPillar: Pillar | null = null;
  if (timePrecision !== 'unknown') {
    hourPillar = buildPillar(
      eightChar.getTimeGan(),
      eightChar.getTimeZhi(),
      eightChar.getTimeShiShenGan(),
      eightChar.getTimeHideGan(),
    );
  }

  // 5. 大運
  const yun = eightChar.getYun(genderCode);
  const daYunArray = yun.getDaYun(10);
  const luckPillars: LuckPillar[] = [];
  for (const daYun of daYunArray) {
    const ganZhi = daYun.getGanZhi();
    // 第一個大運可能是空字串（起運前），跳過
    if (!ganZhi || ganZhi.length < 2) continue;
    luckPillars.push({
      heavenlyStem: mapStem(ganZhi[0]!),
      earthlyBranch: mapBranch(ganZhi[1]!),
      startAge: daYun.getStartAge(),
      endAge: daYun.getEndAge(),
    });
  }

  // 6. 日主強弱分析
  const dayMasterCn = eightChar.getDayGan();
  const dayMasterStem = mapStem(dayMasterCn);
  // getDayWuXing() 返回 "金土" 等雙字（天干五行+地支五行），我們只需天干五行
  const dayMasterElement = stemToElement(dayMasterCn);

  const changShengOffset = LunarUtil.CHANG_SHENG_OFFSET[dayMasterCn];
  const dayZhiIndex = eightChar.getDayZhiIndex();
  const changShengIndex = typeof changShengOffset === 'number'
    ? (changShengOffset + dayZhiIndex) % 12
    : 0;
  const strength = getStrengthFromChangSheng(changShengIndex);

  const dayMasterAnalysis: DayMasterAnalysis = {
    dayMaster: dayMasterStem,
    element: dayMasterElement,
    strength,
    favorableElements: getFavorableElements(dayMasterElement),
    unfavorableElements: getUnfavorableElements(dayMasterElement),
  };

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    luckPillars,
    dayMasterAnalysis,
    usedTrueSolarTime: useTrueSolarTime,
    timePrecision,
  };
}
