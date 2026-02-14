/**
 * 真太陽時計算
 *
 * 真太陽時 = 地方平太陽時 + 均時差(EoT)
 * 地方平太陽時 = UTC + 經度/15 (小時)
 *
 * 均時差公式（Spencer, 1971）：
 * B = 2π(n - 81) / 365（n = 年中第幾天）
 * EoT = 9.87 sin(2B) - 7.53 cos(B) - 1.5 sin(B)（分鐘）
 *
 * 精度要求：±30 秒以內（足以決定時辰邊界）
 */

/**
 * 取得一年中的第幾天（1-based）
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * 計算真太陽時
 *
 * @param utcDatetime - UTC 時間
 * @param longitude - 出生地經度（東經為正，西經為負）
 * @returns 真太陽時 Date 物件
 *
 * @example
 * // 烏魯木齊 (87.6°E) vs 上海 (121.5°E)
 * // 同為 UTC+8 13:00，真太陽時差約 2 小時 16 分
 * // → 可能導致不同時柱
 */
export function calculateTrueSolarTime(
  utcDatetime: Date,
  longitude: number,
): Date {
  const n = getDayOfYear(utcDatetime);
  const B = (2 * Math.PI * (n - 81)) / 365;

  // 均時差（分鐘）
  const eotMinutes =
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B);

  // 地方平太陽時偏移（分鐘）
  const longitudeOffsetMinutes = (longitude / 15) * 60;

  // UTC 偏移（分鐘）= 經度偏移 + 均時差
  const totalOffsetMinutes = longitudeOffsetMinutes + eotMinutes;

  const result = new Date(utcDatetime.getTime() + totalOffsetMinutes * 60000);
  return result;
}
