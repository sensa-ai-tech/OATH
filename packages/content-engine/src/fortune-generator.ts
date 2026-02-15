/**
 * 每日運勢生成器 — 聚合占星行運 + 八字流日 + 模板匹配
 *
 * 這是內容引擎的核心入口，整合所有引擎的計算結果。
 * Edge Function `generate-daily-fortune` 會呼叫此模組。
 */

import type { DailyTransit } from '@oath/shared/types/daily-fortune.js';
import type { DailyBaziAnalysis } from '@oath/shared/types/daily-fortune.js';
import { matchTemplates } from './templates/daily-templates.js';
import { renderTemplate } from './template-engine.js';
import type { TemplateVariables } from './template-engine.js';
import { safetyFilter } from './safety-filter.js';

export interface FortuneGenerationInput {
  /** 占星行運標籤（由 extractTransitTags 產生） */
  readonly transitTags: readonly string[];
  /** 八字流日標籤（由 extractBaziTags 產生） */
  readonly baziTags: readonly string[];
  /** 模板變數 */
  readonly variables: TemplateVariables;
}

export interface GeneratedFortune {
  /** 使用的模板 ID */
  readonly templateId: string;
  /** 渲染後的主要訊息 */
  readonly message: string;
  /** 渲染後的行動建議 */
  readonly actionSuggestion: string;
  /** 是否觸發安全過濾 */
  readonly safetyTriggered: boolean;
  /** 所有匹配的標籤 */
  readonly matchedTags: readonly string[];
}

/**
 * 生成每日運勢
 *
 * 流程：
 * 1. 合併占星 + 八字標籤
 * 2. 用合併標籤匹配最佳模板
 * 3. 填充變數
 * 4. 安全過濾
 */
export function generateDailyFortune(input: FortuneGenerationInput): GeneratedFortune {
  const { transitTags, baziTags, variables } = input;

  // 1. 合併所有標籤
  const allTags = [...new Set([...transitTags, ...baziTags])];

  // 2. 匹配模板（取最佳 1 條）
  const templates = matchTemplates(allTags, 1);
  const template = templates[0]!;

  // 3. 渲染模板
  const rendered = renderTemplate(template, variables);

  // 4. 安全過濾
  const safetyResult = safetyFilter(rendered.message);

  return {
    templateId: template.id,
    message: rendered.message,
    actionSuggestion: rendered.actionSuggestion,
    safetyTriggered: safetyResult.triggered,
    matchedTags: allTags,
  };
}
