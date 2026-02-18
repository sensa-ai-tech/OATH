/**
 * Edge Function: 八字計算（獨立拆分）
 *
 * 使用 lunar-typescript (npm) 計算四柱排盤。
 * Deno 環境透過 npm: specifier 導入。
 */

import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createLogger, generateRequestId } from '../_shared/logger.ts';

const logger = createLogger('compute-bazi');

// ============================================
// Types (inlined from @oath/shared)
// ============================================

type HeavenlyStem = 'jia' | 'yi' | 'bing' | 'ding' | 'wu' | 'ji' | 'geng' | 'xin' | 'ren' | 'gui';
type EarthlyBranch = 'zi' | 'chou' | 'yin' | 'mao' | 'chen' | 'si' | 'wu' | 'wei' | 'shen' | 'you' | 'xu' | 'hai';
type WuXing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
type TenGod = 'bi_jian' | 'jie_cai' | 'shi_shen' | 'shang_guan' | 'zheng_cai' | 'pian_cai' | 'zheng_guan' | 'qi_sha' | 'zheng_yin' | 'pian_yin';
type BirthTimePrecision = 'exact' | 'approximate' | 'unknown';

interface Pillar {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  stemElement: WuXing;
  branchElement: WuXing;
  tenGod?: TenGod;
  hiddenStems: HeavenlyStem[];
}

interface LuckPillar {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  startAge: number;
  endAge: number;
}

interface DayMasterAnalysis {
  dayMaster: HeavenlyStem;
  element: WuXing;
  strength: 'strong' | 'moderate' | 'weak';
  favorableElements: WuXing[];
  unfavorableElements: WuXing[];
}

interface BaziData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  luckPillars: LuckPillar[];
  dayMasterAnalysis: DayMasterAnalysis;
  usedTrueSolarTime: boolean;
  timePrecision: BirthTimePrecision;
}

// ============================================
// Mapping tables
// ============================================

const STEM_MAP: Record<string, HeavenlyStem> = {
  '甲': 'jia', '乙': 'yi', '丙': 'bing', '丁': 'ding', '戊': 'wu',
  '己': 'ji', '庚': 'geng', '辛': 'xin', '壬': 'ren', '癸': 'gui',
};

const BRANCH_MAP: Record<string, EarthlyBranch> = {
  '子': 'zi', '丑': 'chou', '寅': 'yin', '卯': 'mao', '辰': 'chen', '巳': 'si',
  '午': 'wu', '未': 'wei', '申': 'shen', '酉': 'you', '戌': 'xu', '亥': 'hai',
};

const STEM_ELEMENT: Record<string, WuXing> = {
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth',
  '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water',
};

const BRANCH_ELEMENT: Record<string, WuXing> = {
  '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood', '辰': 'earth', '巳': 'fire',
  '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water',
};

const TEN_GOD_MAP: Record<string, TenGod> = {
  '比肩': 'bi_jian', '劫財': 'jie_cai', '劫财': 'jie_cai',
  '食神': 'shi_shen', '傷官': 'shang_guan', '伤官': 'shang_guan',
  '正財': 'zheng_cai', '正财': 'zheng_cai', '偏財': 'pian_cai', '偏财': 'pian_cai',
  '正官': 'zheng_guan', '七殺': 'qi_sha', '七杀': 'qi_sha',
  '正印': 'zheng_yin', '偏印': 'pian_yin', '日主': 'bi_jian',
};

const STEM_WUXING: Record<HeavenlyStem, WuXing> = {
  jia: 'wood', yi: 'wood', bing: 'fire', ding: 'fire', wu: 'earth',
  ji: 'earth', geng: 'metal', xin: 'metal', ren: 'water', gui: 'water',
};

// ============================================
// True Solar Time
// ============================================

function getDayOfYear(date: Date): number {
  const start = new Date(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function calculateTrueSolarTime(utcDatetime: Date, longitude: number): Date {
  const n = getDayOfYear(utcDatetime);
  const B = (2 * Math.PI * (n - 81)) / 365;
  const eotMinutes = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const longitudeOffsetMinutes = (longitude / 15) * 60;
  const totalOffsetMinutes = longitudeOffsetMinutes + eotMinutes;
  return new Date(utcDatetime.getTime() + totalOffsetMinutes * 60000);
}

// ============================================
// Strength analysis
// ============================================

function getStrengthFromChangSheng(index: number): 'strong' | 'moderate' | 'weak' {
  if ([4, 3, 2, 0].includes(index)) return 'strong';
  if ([1, 11, 8, 10].includes(index)) return 'moderate';
  return 'weak';
}

function getFavorableElements(element: WuXing): WuXing[] {
  const generatedBy: Record<WuXing, WuXing> = { fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal', wood: 'water' };
  return [element, generatedBy[element]];
}

function getUnfavorableElements(element: WuXing): WuXing[] {
  const overcomes: Record<WuXing, WuXing> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
  const overcomedBy: Record<WuXing, WuXing> = { earth: 'wood', metal: 'fire', water: 'earth', wood: 'metal', fire: 'water' };
  return [overcomes[element], overcomedBy[element]];
}

// ============================================
// Core Bazi computation
// ============================================

function mapStem(cn: string): HeavenlyStem {
  const m = STEM_MAP[cn];
  if (!m) throw new Error(`Unknown stem: ${cn}`);
  return m;
}

function mapBranch(cn: string): EarthlyBranch {
  const m = BRANCH_MAP[cn];
  if (!m) throw new Error(`Unknown branch: ${cn}`);
  return m;
}

function mapTenGod(cn: string): TenGod | undefined {
  return TEN_GOD_MAP[cn];
}

// deno-lint-ignore no-explicit-any
function computeBaziFromLunar(Solar: any, LunarUtil: any, input: {
  birthDatetime: Date;
  longitude: number;
  genderCode: 0 | 1;
  timePrecision: BirthTimePrecision;
  useTrueSolarTime: boolean;
}): BaziData {
  const { birthDatetime, genderCode, timePrecision, useTrueSolarTime, longitude } = input;

  let computeDate = birthDatetime;
  if (useTrueSolarTime) {
    computeDate = calculateTrueSolarTime(birthDatetime, longitude);
  }

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

  function buildPillar(
    stemCn: string, branchCn: string, tenGodCn: string | null, hiddenStemsCn: string[],
  ): Pillar {
    return {
      heavenlyStem: mapStem(stemCn),
      earthlyBranch: mapBranch(branchCn),
      stemElement: STEM_ELEMENT[stemCn] ?? 'wood',
      branchElement: BRANCH_ELEMENT[branchCn] ?? 'earth',
      tenGod: tenGodCn ? mapTenGod(tenGodCn) : undefined,
      hiddenStems: hiddenStemsCn.map(mapStem),
    };
  }

  const yearPillar = buildPillar(eightChar.getYearGan(), eightChar.getYearZhi(), eightChar.getYearShiShenGan(), eightChar.getYearHideGan());
  const monthPillar = buildPillar(eightChar.getMonthGan(), eightChar.getMonthZhi(), eightChar.getMonthShiShenGan(), eightChar.getMonthHideGan());
  const dayPillar = buildPillar(eightChar.getDayGan(), eightChar.getDayZhi(), eightChar.getDayShiShenGan(), eightChar.getDayHideGan());

  let hourPillar: Pillar | null = null;
  if (timePrecision !== 'unknown') {
    hourPillar = buildPillar(eightChar.getTimeGan(), eightChar.getTimeZhi(), eightChar.getTimeShiShenGan(), eightChar.getTimeHideGan());
  }

  // Luck pillars
  const yun = eightChar.getYun(genderCode);
  const daYunArray = yun.getDaYun(10);
  const luckPillars: LuckPillar[] = [];
  for (const daYun of daYunArray) {
    const ganZhi = daYun.getGanZhi();
    if (!ganZhi || ganZhi.length < 2) continue;
    luckPillars.push({
      heavenlyStem: mapStem(ganZhi[0]!),
      earthlyBranch: mapBranch(ganZhi[1]!),
      startAge: daYun.getStartAge(),
      endAge: daYun.getEndAge(),
    });
  }

  // Day master analysis
  const dayMasterCn = eightChar.getDayGan();
  const dayMasterStem = mapStem(dayMasterCn);
  const dayMasterElement = STEM_WUXING[dayMasterStem];

  const changShengOffset = LunarUtil.CHANG_SHENG_OFFSET[dayMasterCn];
  const dayZhiIndex = eightChar.getDayZhiIndex();
  const changShengIndex = typeof changShengOffset === 'number' ? (changShengOffset + dayZhiIndex) % 12 : 0;
  const strength = getStrengthFromChangSheng(changShengIndex);

  return {
    yearPillar, monthPillar, dayPillar, hourPillar, luckPillars,
    dayMasterAnalysis: {
      dayMaster: dayMasterStem,
      element: dayMasterElement,
      strength,
      favorableElements: getFavorableElements(dayMasterElement),
      unfavorableElements: getUnfavorableElements(dayMasterElement),
    },
    usedTrueSolarTime: useTrueSolarTime,
    timePrecision,
  };
}

// ============================================
// Edge Function Handler
// ============================================

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== 'POST') {
    return errorResponse('GEN_002', 'Method not allowed', 405, generateRequestId());
  }

  const requestId = generateRequestId();
  const timer = logger.startTimer();

  try {
    const lunarTs = await import('npm:lunar-typescript@1.8.6');
    const { Solar, LunarUtil } = lunarTs;

    const body = await req.json();
    const { birthDatetime, longitude, gender, timePrecision } = body as {
      birthDatetime: string;
      longitude: number;
      gender?: 'male' | 'female';
      timePrecision?: BirthTimePrecision;
    };

    if (!birthDatetime || longitude == null) {
      return errorResponse('VAL_003', 'Missing required fields: birthDatetime, longitude', 400, requestId);
    }

    const date = new Date(birthDatetime);
    if (isNaN(date.getTime())) {
      return errorResponse('VAL_001', 'Invalid birthDatetime format', 400, requestId);
    }

    const precision = timePrecision ?? 'exact';
    const genderCode = gender === 'female' ? 1 : 0;
    const useTrueSolarTime = precision === 'exact';

    logger.info('engine.compute', 'Computing bazi chart', { requestId });

    const baziData = computeBaziFromLunar(Solar, LunarUtil, {
      birthDatetime: date,
      longitude,
      genderCode: genderCode as 0 | 1,
      timePrecision: precision,
      useTrueSolarTime,
    });

    const durationMs = timer();
    logger.info('engine.compute', 'Bazi chart computed', { requestId, durationMs });

    return jsonResponse({
      success: true,
      data: baziData,
      engineVersion: '1.0.0',
      computedAt: new Date().toISOString(),
      requestId,
    });
  } catch (err) {
    const durationMs = timer();
    logger.error('engine.error', `Bazi computation failed: ${err}`, { requestId, durationMs });
    return errorResponse('ENG_001', 'Bazi computation failed', 500, requestId, {
      detail: String(err),
    });
  }
});
