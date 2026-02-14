/**
 * 間距系統（基於 4px 網格）
 */

export const spacing = {
  /** 0px */
  '0': 0,
  /** 2px */
  '0.5': 2,
  /** 4px */
  '1': 4,
  /** 8px */
  '2': 8,
  /** 12px */
  '3': 12,
  /** 16px */
  '4': 16,
  /** 20px */
  '5': 20,
  /** 24px */
  '6': 24,
  /** 32px */
  '8': 32,
  /** 40px */
  '10': 40,
  /** 48px */
  '12': 48,
  /** 64px */
  '16': 64,
  /** 80px */
  '20': 80,
  /** 96px */
  '24': 96,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
