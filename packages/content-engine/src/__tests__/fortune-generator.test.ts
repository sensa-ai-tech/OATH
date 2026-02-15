/**
 * 每日運勢生成器測試
 *
 * 測試策略：
 * 1. generateDailyFortune — 端到端生成流程
 * 2. 模板匹配整合 — 不同標籤組合
 * 3. 安全過濾整合
 * 4. 統一模板庫驗證
 */

import { describe, it, expect } from 'vitest';
import { generateDailyFortune } from '../fortune-generator.js';
import { DAILY_TEMPLATES, matchTemplates } from '../templates/daily-templates.js';
import { ZODIAC_TEMPLATES } from '../templates/zodiac-templates.js';
import { PLANETARY_TEMPLATES } from '../templates/planetary-templates.js';
import { ELEMENT_SEASON_TEMPLATES } from '../templates/element-season-templates.js';
import { LIFE_SCENE_TEMPLATES } from '../templates/life-scene-templates.js';

// ============================================
// 1. generateDailyFortune
// ============================================

describe('generateDailyFortune', () => {
  it('should generate a fortune with basic tags', () => {
    const result = generateDailyFortune({
      transitTags: ['trine', 'jupiter'],
      baziTags: ['wood', 'favorable'],
      variables: { sunSign: 'aries', dayElement: 'wood' },
    });

    expect(result.templateId).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.actionSuggestion).toBeTruthy();
    expect(result.safetyTriggered).toBe(false);
    expect(result.matchedTags.length).toBeGreaterThan(0);
  });

  it('should replace template variables in output', () => {
    const result = generateDailyFortune({
      transitTags: ['aries'],
      baziTags: ['wood'],
      variables: { sunSign: 'aries', dayElement: 'wood' },
    });

    // 不應包含未替換的 {{}} 變數
    expect(result.message).not.toContain('{{sunSign}}');
    expect(result.message).not.toContain('{{dayElement}}');
  });

  it('should work with fallback when no tags match', () => {
    const result = generateDailyFortune({
      transitTags: ['nonexistent-tag-abc'],
      baziTags: ['nonexistent-tag-xyz'],
      variables: {},
    });

    // 應回到 fallback 模板
    expect(result.templateId).toBeTruthy();
    expect(result.message).toBeTruthy();
  });

  it('should not trigger safety filter for normal content', () => {
    const result = generateDailyFortune({
      transitTags: ['trine'],
      baziTags: ['fire', 'favorable'],
      variables: { sunSign: 'leo' },
    });

    expect(result.safetyTriggered).toBe(false);
  });

  it('should deduplicate merged tags', () => {
    const result = generateDailyFortune({
      transitTags: ['wood', 'trine'],
      baziTags: ['wood', 'favorable'],
      variables: {},
    });

    // matchedTags 應去重
    const woodCount = result.matchedTags.filter(t => t === 'wood').length;
    expect(woodCount).toBeLessThanOrEqual(1);
  });

  it('should match zodiac-specific templates', () => {
    // 用特定星座標籤測試
    const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    for (const sign of zodiacSigns) {
      const result = generateDailyFortune({
        transitTags: [sign],
        baziTags: [],
        variables: { sunSign: sign },
      });
      expect(result.templateId).toBeTruthy();
    }
  });

  it('should match planet-specific templates', () => {
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars'];

    for (const planet of planets) {
      const result = generateDailyFortune({
        transitTags: [planet],
        baziTags: [],
        variables: {},
      });
      expect(result.templateId).toBeTruthy();
    }
  });
});

// ============================================
// 2. 統一模板庫驗證
// ============================================

describe('Unified Template Library', () => {
  it('should have 200+ total templates', () => {
    expect(DAILY_TEMPLATES.length).toBeGreaterThanOrEqual(200);
  });

  it('should have unique IDs across ALL template files', () => {
    const allIds = DAILY_TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('should have zodiac templates covering all 12 signs', () => {
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    for (const sign of signs) {
      const has = ZODIAC_TEMPLATES.some(t => t.tags.includes(sign));
      expect(has).toBe(true);
    }
  });

  it('should have planetary templates for all major planets', () => {
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars',
      'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

    for (const planet of planets) {
      const has = PLANETARY_TEMPLATES.some(t => t.tags.includes(planet));
      expect(has).toBe(true);
    }
  });

  it('should have element-season templates for all five elements', () => {
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];

    for (const element of elements) {
      const has = ELEMENT_SEASON_TEMPLATES.some(t => t.tags.includes(element));
      expect(has).toBe(true);
    }
  });

  it('should have life scene templates for all categories', () => {
    const categories = ['career', 'relationship', 'health', 'finance', 'growth'];

    for (const cat of categories) {
      const has = LIFE_SCENE_TEMPLATES.some(t => t.tags.includes(cat));
      expect(has).toBe(true);
    }
  });

  it('should not contain forbidden negative words in any template', () => {
    const forbiddenWords = ['糟', '不幸', '倒霉', '災禍', '凶', '厄運'];

    for (const template of DAILY_TEMPLATES) {
      for (const word of forbiddenWords) {
        expect(template.message).not.toContain(word);
        expect(template.actionSuggestion).not.toContain(word);
      }
    }
  });

  it('should have all action suggestions > 10 characters', () => {
    for (const template of DAILY_TEMPLATES) {
      expect(template.actionSuggestion.length).toBeGreaterThan(10);
    }
  });

  it('should matchTemplates for each individual zodiac', () => {
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    for (const sign of signs) {
      const results = matchTemplates([sign]);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should matchTemplates for daymaster strength tags', () => {
    const strengths = ['daymaster-strong', 'daymaster-moderate', 'daymaster-weak'];

    for (const strength of strengths) {
      const results = matchTemplates([strength]);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should matchTemplates for seasonal tags', () => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];

    for (const season of seasons) {
      const results = matchTemplates([season]);
      expect(results.length).toBeGreaterThan(0);
    }
  });
});
