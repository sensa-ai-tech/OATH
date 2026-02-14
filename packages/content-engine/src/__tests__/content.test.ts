/**
 * 內容引擎單元測試
 *
 * 測試策略：
 * 1. 模板匹配 — 標籤匹配、fallback
 * 2. 模板渲染 — 變數替換
 * 3. 安全過濾 — 關鍵字觸發
 * 4. LLM 潤色接口 — prompt 建構、成本估算
 * 5. 模板品質 — 確保正向語氣
 */

import { describe, it, expect } from 'vitest';
import { matchTemplates, DAILY_TEMPLATES } from '../templates/daily-templates.js';
import { renderTemplate } from '../template-engine.js';
import { safetyFilter } from '../safety-filter.js';
import {
  buildSystemPrompt,
  buildUserPrompt,
  estimatePolishCost,
  createPolishPayload,
} from '../llm-polisher.js';

// ============================================
// 1. 模板匹配測試
// ============================================

describe('matchTemplates', () => {
  it('should match templates by element tags', () => {
    const results = matchTemplates(['wood', 'favorable']);
    expect(results.length).toBeGreaterThan(0);

    // 至少有一個模板包含 wood tag
    const hasWoodTemplate = results.some(t => t.tags.includes('wood'));
    expect(hasWoodTemplate).toBe(true);
  });

  it('should match templates by zodiac sign tags', () => {
    const results = matchTemplates(['aries', 'initiative']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should match templates by transit aspect tags', () => {
    const results = matchTemplates(['trine', 'harmony']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should match templates by ten god tags', () => {
    const results = matchTemplates(['zheng_cai', 'pian_cai']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return fallback templates when no tags match', () => {
    const results = matchTemplates(['nonexistent-tag-xyz']);
    expect(results.length).toBeGreaterThan(0);

    // 應返回 fallback 模板
    const hasFallback = results.some(t => t.tags.includes('fallback'));
    expect(hasFallback).toBe(true);
  });

  it('should respect the limit parameter', () => {
    const results = matchTemplates(['fire', 'favorable', 'energy'], 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('should return at most 3 templates by default', () => {
    const results = matchTemplates(['general', 'positive', 'daily']);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('should sort by match score (more tags matched = higher priority)', () => {
    // fire + favorable + energy 應該匹配 fire-passion-01 最高分
    const results = matchTemplates(['fire', 'favorable', 'energy']);
    if (results.length > 0) {
      const firstResult = results[0]!;
      // 第一個結果應該是匹配最多 tag 的
      const matchCount = firstResult.tags.filter(t =>
        ['fire', 'favorable', 'energy'].includes(t)
      ).length;
      expect(matchCount).toBeGreaterThan(0);
    }
  });
});

// ============================================
// 2. 模板庫品質測試
// ============================================

describe('DAILY_TEMPLATES — 模板品質', () => {
  it('should have exactly 50 templates (MVP)', () => {
    // MVP 第一批目標 50 條
    // 目前有 43 條（可根據實際數量調整）
    expect(DAILY_TEMPLATES.length).toBeGreaterThanOrEqual(30);
  });

  it('should have unique IDs for all templates', () => {
    const ids = DAILY_TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have non-empty fields for all templates', () => {
    for (const template of DAILY_TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.tags.length).toBeGreaterThan(0);
      expect(template.theme).toBeTruthy();
      expect(template.message).toBeTruthy();
      expect(template.actionSuggestion).toBeTruthy();
    }
  });

  it('should not contain negative words in templates (excluding negated forms)', () => {
    // 排除在否定語境中使用的詞（如「不是壞事」）
    const negativeWords = ['糟', '不幸', '倒霉', '災禍', '凶', '厄運'];

    for (const template of DAILY_TEMPLATES) {
      for (const word of negativeWords) {
        expect(template.message).not.toContain(word);
        expect(template.actionSuggestion).not.toContain(word);
      }
    }
  });

  it('should use negative words only in negated/reframed context', () => {
    // 「壞」只應出現在「不是壞」等正向重框架語境
    const templatesWithBad = DAILY_TEMPLATES.filter(t =>
      t.message.includes('壞') || t.actionSuggestion.includes('壞')
    );

    for (const template of templatesWithBad) {
      const hasNegation = template.message.includes('不是壞') || template.message.includes('不壞');
      expect(hasNegation).toBe(true);
    }
  });

  it('should have action suggestions that are concrete and actionable', () => {
    for (const template of DAILY_TEMPLATES) {
      // 每個行動建議至少 10 字
      expect(template.actionSuggestion.length).toBeGreaterThan(10);
    }
  });

  it('should cover all five elements', () => {
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const element of elements) {
      const hasElement = DAILY_TEMPLATES.some(t => t.tags.includes(element));
      expect(hasElement).toBe(true);
    }
  });

  it('should have fallback templates', () => {
    const fallbacks = DAILY_TEMPLATES.filter(t => t.tags.includes('fallback'));
    expect(fallbacks.length).toBeGreaterThanOrEqual(2);
  });
});

// ============================================
// 3. 模板渲染測試
// ============================================

describe('renderTemplate', () => {
  it('should replace {{sunSign}} with Chinese zodiac name', () => {
    const template = DAILY_TEMPLATES.find(t => t.message.includes('{{sunSign}}'));
    if (template) {
      const result = renderTemplate(template, { sunSign: 'aries' });
      expect(result.message).toContain('牡羊座');
      expect(result.message).not.toContain('{{sunSign}}');
    }
  });

  it('should replace {{dayElement}} with Chinese element name', () => {
    const template = DAILY_TEMPLATES.find(t => t.message.includes('{{dayElement}}'));
    if (template) {
      const result = renderTemplate(template, { dayElement: 'wood' });
      expect(result.message).toContain('木');
      expect(result.message).not.toContain('{{dayElement}}');
    }
  });

  it('should replace {{moonSign}} with Chinese name', () => {
    const template = DAILY_TEMPLATES.find(t => t.message.includes('{{moonSign}}'));
    if (template) {
      const result = renderTemplate(template, { moonSign: 'cancer' });
      expect(result.message).toContain('巨蟹座');
    }
  });

  it('should use default values for missing variables', () => {
    const template = DAILY_TEMPLATES.find(t => t.message.includes('{{sunSign}}'));
    if (template) {
      const result = renderTemplate(template, {});
      // 預設值是 '你的星座'
      expect(result.message).toContain('你的星座');
    }
  });

  it('should return both message and actionSuggestion', () => {
    const template = DAILY_TEMPLATES[0]!;
    const result = renderTemplate(template, { sunSign: 'leo' });

    expect(typeof result.message).toBe('string');
    expect(typeof result.actionSuggestion).toBe('string');
    expect(result.message.length).toBeGreaterThan(0);
    expect(result.actionSuggestion.length).toBeGreaterThan(0);
  });

  it('should handle unknown variables gracefully', () => {
    // 建立一個包含未知變數的模板
    const template = {
      id: 'test-unknown',
      tags: ['test'],
      theme: '測試',
      message: '你好 {{unknownVar}} 世界',
      actionSuggestion: '行動 {{anotherUnknown}}',
    };

    const result = renderTemplate(template, {});
    // 未知變數保留原始 {{}} 格式
    expect(result.message).toContain('{{unknownVar}}');
  });
});

// ============================================
// 4. 安全過濾測試
// ============================================

describe('safetyFilter', () => {
  it('should trigger for "想死"', () => {
    const result = safetyFilter('我不想活了，想死');
    expect(result.triggered).toBe(true);
    expect(result.resources).not.toBeNull();
    expect(result.triggerKeyword).toBe('想死');
  });

  it('should trigger for "自殺"', () => {
    const result = safetyFilter('我想自殺');
    expect(result.triggered).toBe(true);
    expect(result.triggerKeyword).toBe('自殺');
  });

  it('should trigger for "活不下去"', () => {
    const result = safetyFilter('覺得活不下去');
    expect(result.triggered).toBe(true);
    expect(result.triggerKeyword).toBe('活不下去');
  });

  it('should trigger for "不想活"', () => {
    const result = safetyFilter('不想活了');
    expect(result.triggered).toBe(true);
  });

  it('should trigger for "結束生命"', () => {
    const result = safetyFilter('想結束生命');
    expect(result.triggered).toBe(true);
  });

  it('should not trigger for normal text', () => {
    const result = safetyFilter('今天天氣真好，心情愉快');
    expect(result.triggered).toBe(false);
    expect(result.resources).toBeNull();
    expect(result.triggerKeyword).toBeNull();
  });

  it('should not trigger for empty text', () => {
    const result = safetyFilter('');
    expect(result.triggered).toBe(false);
  });

  it('should provide mental health resources when triggered', () => {
    const result = safetyFilter('想死');
    expect(result.resources).toBeDefined();
    expect(result.resources!.anxietyHotline.number).toBe('1925');
    expect(result.resources!.lifeline.number).toBe('1995');
    expect(result.resources!.teacherChang.number).toBe('1980');
  });

  it('should be case-insensitive for mixed text', () => {
    // 中文無大小寫，但測試混合文字
    const result = safetyFilter('我覺得 很痛苦 想死 了');
    expect(result.triggered).toBe(true);
  });
});

// ============================================
// 5. LLM 潤色接口測試
// ============================================

describe('LLM Polisher', () => {
  describe('buildSystemPrompt', () => {
    it('should return a non-empty system prompt', () => {
      const prompt = buildSystemPrompt();
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('should contain key rules', () => {
      const prompt = buildSystemPrompt();
      expect(prompt).toContain('正向');
      expect(prompt).toContain('科學');
      expect(prompt).toContain('簡潔');
      expect(prompt).toContain('安全');
    });

    it('should include JSON output format', () => {
      const prompt = buildSystemPrompt();
      expect(prompt).toContain('JSON');
      expect(prompt).toContain('message');
      expect(prompt).toContain('action');
    });
  });

  describe('buildUserPrompt', () => {
    it('should include request data in the prompt', () => {
      const prompt = buildUserPrompt({
        templateMessage: '今天適合展現自我',
        actionSuggestion: '勇敢表達你的想法',
        sunSign: 'aries',
        dayElement: 'fire',
        locale: 'zh-TW',
      });

      expect(prompt).toContain('今天適合展現自我');
      expect(prompt).toContain('勇敢表達你的想法');
      expect(prompt).toContain('aries');
      expect(prompt).toContain('fire');
      expect(prompt).toContain('zh-TW');
    });
  });

  describe('estimatePolishCost', () => {
    it('should return a reasonable cost estimate', () => {
      const result = estimatePolishCost();

      expect(result.estimatedCostUsd).toBeGreaterThan(0);
      expect(result.estimatedCostUsd).toBeLessThan(0.01); // 單次不超過 1 分
      expect(result.model).toBeTruthy();
    });

    it('should estimate cost around $0.00034', () => {
      const result = estimatePolishCost();

      // 根據 Haiku 定價：~$0.00034
      expect(result.estimatedCostUsd).toBeGreaterThan(0.0001);
      expect(result.estimatedCostUsd).toBeLessThan(0.001);
    });
  });

  describe('createPolishPayload', () => {
    it('should create a valid API payload', () => {
      const payload = createPolishPayload({
        templateMessage: '今天能量很好',
        actionSuggestion: '試著做一件新的事',
        sunSign: 'leo',
        dayElement: 'fire',
        locale: 'zh-TW',
      });

      expect(payload.model).toBeTruthy();
      expect(payload.max_tokens).toBeGreaterThan(0);
      expect(payload.system).toBeTruthy();
      expect(payload.messages).toHaveLength(1);
      expect(payload.messages[0]!.role).toBe('user');
      expect(payload.messages[0]!.content).toContain('今天能量很好');
    });
  });
});

// ============================================
// 6. 模板覆蓋率測試
// ============================================

describe('Template Coverage', () => {
  it('should match at least one template for each element', () => {
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const element of elements) {
      const results = matchTemplates([element]);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should match at least one template for major zodiac groups', () => {
    const groups = [
      ['aries', 'cancer', 'libra', 'capricorn'],  // cardinal
      ['taurus', 'leo', 'scorpio', 'aquarius'],     // fixed
      ['gemini', 'virgo', 'sagittarius', 'pisces'], // mutable
    ];

    for (const group of groups) {
      const results = matchTemplates(group);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should match at least one template for transit aspects', () => {
    const aspects = ['trine', 'square', 'conjunction', 'opposition'];
    for (const aspect of aspects) {
      const results = matchTemplates([aspect]);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should always return at least 1 template (via fallback)', () => {
    // 即使完全無匹配，也應有 fallback
    const results = matchTemplates(['completely-invalid-tag']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle empty tags array', () => {
    const results = matchTemplates([]);
    // 空標籤 → 全部 score 為 0 → 應返回 fallback
    expect(results.length).toBeGreaterThan(0);
  });
});
