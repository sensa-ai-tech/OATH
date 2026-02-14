/**
 * 字體系統
 */

export const typography = {
  fontFamily: {
    /** 主要無襯線字體（中英混排） */
    sans: '"Noto Sans TC", "Inter", system-ui, sans-serif',
    /** 裝飾用襯線字體（命理標題） */
    serif: '"Noto Serif TC", "Playfair Display", serif',
    /** 等寬字體（命盤數據） */
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export type Typography = typeof typography;
