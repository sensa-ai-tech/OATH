/**
 * 品牌色彩系統 — 神秘但不迷信、古老但很現代
 */

export const colors = {
  brand: {
    /** 紫色 — 神秘感主色 */
    primary: '#6B4CE6',
    /** 金色 — 東方意象 */
    secondary: '#E6A84C',
    /** 星空藍 */
    accent: '#4CA6E6',
  },
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  /** 命理五行色彩 */
  fortune: {
    fire: '#FF5722',
    water: '#1565C0',
    wood: '#2E7D32',
    metal: '#9E9E9E',
    earth: '#795548',
  },
  /** 黃道十二星座代表色 */
  zodiac: {
    aries: '#FF4444',
    taurus: '#4CAF50',
    gemini: '#FFD700',
    cancer: '#C0C0C0',
    leo: '#FF8C00',
    virgo: '#8B4513',
    libra: '#FF69B4',
    scorpio: '#800000',
    sagittarius: '#9370DB',
    capricorn: '#2F4F4F',
    aquarius: '#00CED1',
    pisces: '#7B68EE',
  },
  surface: {
    /** 深色星空底 */
    background: '#0A0A1A',
    card: '#1A1A2E',
    cardHover: '#2A2A3E',
    overlay: 'rgba(0,0,0,0.6)',
  },
  text: {
    primary: '#F0F0F0',
    secondary: '#A0A0B0',
    muted: '#606070',
    inverse: '#0A0A1A',
  },
} as const;

export type Colors = typeof colors;
