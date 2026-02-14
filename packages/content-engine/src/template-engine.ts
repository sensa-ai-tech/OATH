/**
 * 模板引擎 — 變數填充 + 正向重框架
 */

import type { FortuneTemplate } from './templates/daily-templates.js';

export interface TemplateVariables {
  /** 太陽星座（中文） */
  readonly sunSign?: string;
  /** 月亮星座（中文） */
  readonly moonSign?: string;
  /** 流日五行（中文） */
  readonly dayElement?: string;
  /** 日主（中文） */
  readonly dayMaster?: string;
  /** 用戶名稱（可選） */
  readonly userName?: string;
}

/** 星座英文 → 中文 */
const SIGN_CN: Record<string, string> = {
  aries: '牡羊座', taurus: '金牛座', gemini: '雙子座', cancer: '巨蟹座',
  leo: '獅子座', virgo: '處女座', libra: '天秤座', scorpio: '天蠍座',
  sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '雙魚座',
};

/** 五行英文 → 中文 */
const ELEMENT_CN: Record<string, string> = {
  wood: '木', fire: '火', earth: '土', metal: '金', water: '水',
};

/**
 * 填充模板變數
 */
export function renderTemplate(
  template: FortuneTemplate,
  variables: TemplateVariables,
): { message: string; actionSuggestion: string } {
  const vars: Record<string, string> = {
    sunSign: variables.sunSign
      ? (SIGN_CN[variables.sunSign] ?? variables.sunSign)
      : '你的星座',
    moonSign: variables.moonSign
      ? (SIGN_CN[variables.moonSign] ?? variables.moonSign)
      : '月亮',
    dayElement: variables.dayElement
      ? (ELEMENT_CN[variables.dayElement] ?? variables.dayElement)
      : '今日',
    dayMaster: variables.dayMaster ?? '你',
    userName: variables.userName ?? '你',
  };

  const message = replaceVars(template.message, vars);
  const actionSuggestion = replaceVars(template.actionSuggestion, vars);

  return { message, actionSuggestion };
}

function replaceVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return vars[key] ?? `{{${key}}}`;
  });
}
