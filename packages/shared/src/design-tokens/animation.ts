/**
 * 動畫常數 — 統一 Web (Framer Motion) 與 Mobile (Reanimated) 的時間軸
 */

export const animation = {
  duration: {
    /** 100ms — 即時反饋 */
    instant: 100,
    /** 200ms — 按鈕反饋 */
    fast: 200,
    /** 300ms — 頁面轉場 */
    normal: 300,
    /** 400ms — 卡片展開 */
    expand: 400,
    /** 500ms — 慢速過渡 */
    slow: 500,
    /** 800ms — 卡片揭示 */
    reveal: 800,
  },
  easing: {
    /** Material Design standard */
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    /** 減速（進入畫面） */
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    /** 加速（離開畫面） */
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    /** 彈性（強調動畫） */
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Animation = typeof animation;
