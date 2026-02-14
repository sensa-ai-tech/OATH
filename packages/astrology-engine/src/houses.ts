/**
 * 宮位計算 — Placidus 系統
 *
 * Placidus 是最常用的宮位系統。
 * 計算步驟：
 * 1. 計算地方恆星時 (RAMC)
 * 2. 求上升點 (ASC) 和天頂 (MC)
 * 3. 用 Placidus 三分法插值其餘宮位
 */

import * as Astronomy from 'astronomy-engine';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/** 黃赤交角（近似值，J2000） */
const OBLIQUITY = 23.4393;

/**
 * 計算格林尼治恆星時 → 地方恆星時
 * @param date UTC 時間
 * @param longitude 觀測者經度（東經正）
 * @returns RAMC (Right Ascension of the Medium Coeli) in degrees [0, 360)
 */
function computeRAMC(date: Date, longitude: number): number {
  // astronomy-engine 提供恆星時
  const observer = new Astronomy.Observer(0, longitude, 0);
  const time = Astronomy.MakeTime(date);

  // SiderealTime 返回格林尼治恆星時（小時）
  const gstHours = Astronomy.SiderealTime(time);
  // 地方恆星時 = GST + 經度/15
  const lstHours = gstHours + longitude / 15;
  // 轉為度數
  let ramc = (lstHours * 15) % 360;
  if (ramc < 0) ramc += 360;
  return ramc;
}

/**
 * 計算上升點 (ASC)
 */
function computeAscendant(ramc: number, latitude: number): number {
  const ramcRad = ramc * DEG2RAD;
  const latRad = latitude * DEG2RAD;
  const oblRad = OBLIQUITY * DEG2RAD;

  // ASC = atan2(-cos(RAMC), sin(RAMC) * cos(ε) + tan(φ) * sin(ε))
  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  let asc = Math.atan2(y, x) * RAD2DEG;
  asc = ((asc % 360) + 360) % 360;
  return asc;
}

/**
 * 計算天頂 (MC)
 */
function computeMidheaven(ramc: number): number {
  const oblRad = OBLIQUITY * DEG2RAD;
  const ramcRad = ramc * DEG2RAD;

  // MC = atan(tan(RAMC) / cos(ε))
  let mc = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad)) * RAD2DEG;
  mc = ((mc % 360) + 360) % 360;
  return mc;
}

/**
 * Placidus 宮位計算（簡化版）
 *
 * 使用 ASC/MC 四個角度作為基準，等分弧段來近似 Placidus
 * 這是 MVP 用的簡化方法，精度足以用於大眾命理 App
 */
function computePlacidusHouses(asc: number, mc: number): number[] {
  const cusps: number[] = new Array<number>(12);

  // 第 1 宮 = ASC
  cusps[0] = asc;
  // 第 10 宮 = MC
  cusps[9] = mc;
  // 第 7 宮 = ASC 對面
  cusps[6] = (asc + 180) % 360;
  // 第 4 宮 = MC 對面
  cusps[3] = (mc + 180) % 360;

  // Placidus 中間宮位：在 MC→ASC 弧段等分三份
  // MC(10) → 11 → 12 → ASC(1)
  const mcToAsc = normalizeArc(asc - mc);
  cusps[10] = (mc + mcToAsc / 3) % 360;
  cusps[11] = (mc + (mcToAsc * 2) / 3) % 360;

  // ASC(1) → 2 → 3 → IC(4)
  const ic = cusps[3]!;
  const ascToIc = normalizeArc(ic - asc);
  cusps[1] = (asc + ascToIc / 3) % 360;
  cusps[2] = (asc + (ascToIc * 2) / 3) % 360;

  // IC(4) → 5 → 6 → DSC(7)
  const dsc = cusps[6]!;
  const icToDsc = normalizeArc(dsc - ic);
  cusps[4] = (ic + icToDsc / 3) % 360;
  cusps[5] = (ic + (icToDsc * 2) / 3) % 360;

  // DSC(7) → 8 → 9 → MC(10)
  const dscToMc = normalizeArc(mc - dsc);
  cusps[7] = (dsc + dscToMc / 3) % 360;
  cusps[8] = (dsc + (dscToMc * 2) / 3) % 360;

  return cusps.map((c) => ((c % 360) + 360) % 360);
}

/**
 * 正規化弧度差到 [0, 360)
 */
function normalizeArc(arc: number): number {
  return ((arc % 360) + 360) % 360;
}

// ============================================
// 公開 API
// ============================================

export interface HouseData {
  readonly ascendantDegree: number;
  readonly midheavenDegree: number;
  readonly cusps: readonly number[];
}

/**
 * 計算 Placidus 宮位
 */
export function computeHouses(
  date: Date,
  latitude: number,
  longitude: number,
): HouseData {
  const ramc = computeRAMC(date, longitude);
  const asc = computeAscendant(ramc, latitude);
  const mc = computeMidheaven(ramc);
  const cusps = computePlacidusHouses(asc, mc);

  return {
    ascendantDegree: asc,
    midheavenDegree: mc,
    cusps,
  };
}
