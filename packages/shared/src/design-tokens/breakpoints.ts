/**
 * 響應式斷點（Web 使用）
 */

export const breakpoints = {
  /** 手機 */
  sm: 640,
  /** 平板 */
  md: 768,
  /** 筆電 */
  lg: 1024,
  /** 桌面 */
  xl: 1280,
  /** 大螢幕 */
  '2xl': 1536,
} as const;

export type Breakpoints = typeof breakpoints;
