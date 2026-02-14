/**
 * 引擎版本與配置常數
 */

/** 當前排盤引擎版本 */
export const ENGINE_VERSION = '1.0.0' as const;

/** 相位容許度（角度） */
export const ASPECT_ORBS = {
  conjunction: 8,
  sextile: 6,
  square: 7,
  trine: 8,
  opposition: 8,
} as const;

/** Claude Haiku 定價（USD per 1M tokens） */
export const LLM_PRICING = {
  model: 'claude-3-5-haiku-20241022',
  inputPer1MTokens: 0.25,
  outputPer1MTokens: 1.25,
} as const;

/** 預估每次潤色的 token 數 */
export const ESTIMATED_POLISH_TOKENS = {
  systemPrompt: 200,
  userPrompt: 150,
  inputTotal: 350,
  output: 200,
} as const;

/** 安全過濾關鍵字（觸發專業資源引導） */
export const SAFETY_KEYWORDS = [
  '想死', '不想活', '活不下去', '自殺', '結束生命',
  '尋死', '了結', '跳樓', '割腕', '安眠藥',
] as const;

/** 心理健康專線（台灣） */
export const MENTAL_HEALTH_RESOURCES = {
  anxietyHotline: { name: '衛生福利部安心專線', number: '1925' },
  lifeline: { name: '生命線', number: '1995' },
  teacherChang: { name: '張老師', number: '1980' },
} as const;
