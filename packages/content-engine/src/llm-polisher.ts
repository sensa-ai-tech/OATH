/**
 * LLM 潤色接口 — Claude Haiku
 *
 * 6 級 Fallback 矩陣：
 * L1: LLM 潤色（Premium）
 * L2: 模板原文
 * L3: Fallback 模板
 * L4: 靜態正向訊息
 * L5: 快取的上一次結果
 * L6: 503 — 服務暫時不可用
 */

import { LLM_PRICING, ESTIMATED_POLISH_TOKENS } from '@oath/shared/constants/engine.js';

export interface PolishRequest {
  /** 模板生成的原始訊息 */
  readonly templateMessage: string;
  /** 行動建議 */
  readonly actionSuggestion: string;
  /** 太陽星座 */
  readonly sunSign: string;
  /** 流日五行 */
  readonly dayElement: string;
  /** 使用者語系 */
  readonly locale: string;
}

export interface PolishResponse {
  readonly polishedMessage: string;
  readonly polishedAction: string;
  readonly tokensInput: number;
  readonly tokensOutput: number;
  readonly model: string;
  readonly costUsd: number;
}

/**
 * 建立 LLM System Prompt
 */
export function buildSystemPrompt(): string {
  return `你是 Oath 的命理解說員，任務是將模板生成的每日運勢潤色成更自然、更溫暖的語言。

規則：
1. 保持正向：永遠不要用「壞」「糟」「不幸」等負面詞彙
2. 保持科學：用心理學/正向引導的語言，避免迷信或恐嚇
3. 保持簡潔：訊息不超過 150 字，行動建議不超過 80 字
4. 保持真實：不要誇大或做空泛的承諾
5. 保持個人化：讓使用者感覺這是「對我說的」而非群發訊息
6. 安全底線：如果內容涉及健康、法律、財務決策，加上「建議諮詢專業人士」

輸出格式（JSON）：
{
  "message": "潤色後的訊息",
  "action": "潤色後的行動建議"
}`;
}

/**
 * 建立 LLM User Prompt
 */
export function buildUserPrompt(request: PolishRequest): string {
  return `請潤色以下每日運勢內容：

太陽星座：${request.sunSign}
今日五行：${request.dayElement}
語系：${request.locale}

原始訊息：
${request.templateMessage}

原始行動建議：
${request.actionSuggestion}

請用更自然溫暖的語言重寫，保持核心意思不變。`;
}

/**
 * 估算潤色成本
 */
export function estimatePolishCost(): {
  estimatedCostUsd: number;
  model: string;
} {
  const inputCost =
    (ESTIMATED_POLISH_TOKENS.inputTotal / 1_000_000) * LLM_PRICING.inputPer1MTokens;
  const outputCost =
    (ESTIMATED_POLISH_TOKENS.output / 1_000_000) * LLM_PRICING.outputPer1MTokens;

  return {
    estimatedCostUsd: inputCost + outputCost,
    model: LLM_PRICING.model,
  };
}

/**
 * 實際呼叫 LLM API 進行潤色
 *
 * 注意：此函式由 Edge Function 呼叫，需要 ANTHROPIC_API_KEY
 * 本模組只提供 prompt 建構和成本估算
 * 實際 HTTP 呼叫在 Edge Function 中進行
 */
export function createPolishPayload(request: PolishRequest): {
  model: string;
  max_tokens: number;
  system: string;
  messages: Array<{ role: string; content: string }>;
} {
  return {
    model: LLM_PRICING.model,
    max_tokens: 300,
    system: buildSystemPrompt(),
    messages: [
      { role: 'user', content: buildUserPrompt(request) },
    ],
  };
}
