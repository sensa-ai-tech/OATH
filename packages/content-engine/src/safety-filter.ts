/**
 * 安全過濾器 — 偵測負面情緒關鍵字，引導使用者尋求專業協助
 */

import { SAFETY_KEYWORDS, MENTAL_HEALTH_RESOURCES } from '@oath/shared/constants/engine.js';

export interface SafetyFilterResult {
  readonly triggered: boolean;
  readonly resources: typeof MENTAL_HEALTH_RESOURCES | null;
  /** 觸發的關鍵字（僅用於 system_logs，不記錄使用者原文） */
  readonly triggerKeyword: string | null;
}

/**
 * 檢查文字中是否包含安全關鍵字
 * 若觸發，返回專業心理健康資源
 */
export function safetyFilter(text: string): SafetyFilterResult {
  const normalizedText = text.toLowerCase().trim();

  for (const keyword of SAFETY_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      return {
        triggered: true,
        resources: MENTAL_HEALTH_RESOURCES,
        triggerKeyword: keyword,
      };
    }
  }

  return {
    triggered: false,
    resources: null,
    triggerKeyword: null,
  };
}
