/**
 * 內容生成引擎
 *
 * - templates/daily-templates.ts: 50 條正向引導模板（MVP）
 * - template-engine.ts: 匹配 + 變數填充
 * - llm-polisher.ts: Claude Haiku 潤色接口
 * - safety-filter.ts: 負面情緒關鍵字安全過濾
 */

export const CONTENT_ENGINE_VERSION = '1.0.0';

// 模板系統
export { DAILY_TEMPLATES, matchTemplates } from './templates/daily-templates.js';
export type { FortuneTemplate } from './templates/daily-templates.js';
export { renderTemplate } from './template-engine.js';
export type { TemplateVariables } from './template-engine.js';

// LLM 潤色
export {
  buildSystemPrompt,
  buildUserPrompt,
  estimatePolishCost,
  createPolishPayload,
} from './llm-polisher.js';
export type { PolishRequest, PolishResponse } from './llm-polisher.js';

// 安全過濾
export { safetyFilter } from './safety-filter.js';
export type { SafetyFilterResult } from './safety-filter.js';
