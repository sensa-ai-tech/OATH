/**
 * 每日運勢相關型別定義
 */

import type { AspectData, PlanetPosition, ZodiacSign } from './natal-chart.js';
import type { HeavenlyStem, EarthlyBranch, WuXing } from './natal-chart.js';

/** 每日行運摘要（西洋占星） */
export interface DailyTransit {
  /** 當日重要行運 */
  readonly transits: readonly TransitEvent[];
  /** 月亮所在星座 */
  readonly moonSign: ZodiacSign;
  /** 當日重要相位 */
  readonly significantAspects: readonly AspectData[];
}

/** 單一行運事件 */
export interface TransitEvent {
  readonly transitPlanet: PlanetPosition;
  readonly natalPlanet: PlanetPosition;
  readonly aspect: AspectData;
  /** 行運影響描述鍵值（對應模板） */
  readonly interpretationKey: string;
}

/** 每日八字分析 */
export interface DailyBaziAnalysis {
  /** 流日天干 */
  readonly dayStem: HeavenlyStem;
  /** 流日地支 */
  readonly dayBranch: EarthlyBranch;
  /** 流日五行 */
  readonly dayElement: WuXing;
  /** 流日與日主的關係（十神） */
  readonly dayRelation: string;
  /** 與命盤的互動摘要鍵值 */
  readonly interpretationKey: string;
}

/** 每日運勢（完整） */
export interface DailyFortune {
  readonly id: string;
  readonly userId: string;
  /** 日期（YYYY-MM-DD） */
  readonly fortuneDate: string;
  /** 西洋行運資料 */
  readonly astrologyTransit: DailyTransit | null;
  /** 八字流日分析 */
  readonly baziDayAnalysis: DailyBaziAnalysis | null;
  /** 使用的模板 ID */
  readonly templateId: string | null;
  /** 模板生成的原始訊息 */
  readonly templateMessage: string;
  /** LLM 潤色後的訊息（Premium 功能） */
  readonly polishedMessage: string | null;
  /** 具體可執行的行動建議 */
  readonly actionSuggestion: string;
  /** 分享卡片圖片 URL */
  readonly shareCardUrl: string | null;
  /** LLM 輸入 token 數 */
  readonly llmTokensInput: number;
  /** LLM 輸出 token 數 */
  readonly llmTokensOutput: number;
  /** 使用的 LLM 模型 */
  readonly llmModel: string | null;
  /** LLM 成本（USD） */
  readonly llmCostUsd: number;
  /** 排盤引擎版本 */
  readonly engineVersion: string;
  readonly createdAt: string;
}

/** 每日運勢摘要（用於列表） */
export interface DailyFortuneSummary {
  readonly id: string;
  readonly fortuneDate: string;
  /** 核心訊息（截取） */
  readonly message: string;
  readonly shareCardUrl: string | null;
}
