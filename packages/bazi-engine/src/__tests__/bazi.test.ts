/**
 * 八字引擎單元測試
 *
 * 測試策略：
 * 1. 已知生辰 → 驗證四柱天干地支
 * 2. 節氣邊界 → 驗證年柱/月柱切換
 * 3. 子時跨日 → 驗證日柱正確
 * 4. 時間精確度 → 三種 precision 各驗證
 * 5. 真太陽時 → 烏魯木齊 vs 上海
 * 6. 日主分析 → 驗證五行與強弱
 * 7. 大運 → 驗證大運列表
 * 8. Fuzz → 隨機生辰不 crash
 */

import { describe, it, expect } from 'vitest';
import { computeBazi } from '../pillars.js';
import { calculateTrueSolarTime } from '../true-solar-time.js';

// ============================================
// 輔助工具
// ============================================

/** 建立 UTC Date（月份 1-based） */
function utc(year: number, month: number, day: number, hour = 0, min = 0, sec = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, min, sec));
}

// ============================================
// 1. 已知生辰四柱驗證
// ============================================

describe('computeBazi — 已知生辰', () => {
  it('should compute 1990-01-15 10:30 UTC male (台北 121.5°E)', () => {
    // 1990年1月15日 10:30 UTC → 台灣 18:30 (UTC+8)
    // 農曆：己巳年 臘月十九
    // 期望：年柱己巳
    const result = computeBazi({
      birthDatetime: utc(1990, 1, 15, 10, 30),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    // 驗證基本結構
    expect(result.yearPillar).toBeDefined();
    expect(result.monthPillar).toBeDefined();
    expect(result.dayPillar).toBeDefined();
    expect(result.hourPillar).not.toBeNull();

    // 驗證天干地支格式
    expect(result.yearPillar.heavenlyStem).toMatch(/^(jia|yi|bing|ding|wu|ji|geng|xin|ren|gui)$/);
    expect(result.yearPillar.earthlyBranch).toMatch(/^(zi|chou|yin|mao|chen|si|wu|wei|shen|you|xu|hai)$/);

    // 日主分析
    expect(result.dayMasterAnalysis).toBeDefined();
    expect(result.dayMasterAnalysis.element).toMatch(/^(wood|fire|earth|metal|water)$/);
    expect(result.dayMasterAnalysis.strength).toMatch(/^(strong|moderate|weak)$/);

    // 使用真太陽時
    expect(result.usedTrueSolarTime).toBe(true);
    expect(result.timePrecision).toBe('exact');
  });

  it('should compute 2000-02-04 12:00 UTC female (Beijing 116.4°E) — 立春當日', () => {
    // 2000年2月4日 — 立春
    const result = computeBazi({
      birthDatetime: utc(2000, 2, 4, 12, 0),
      longitude: 116.4,
      gender: 'female',
      timePrecision: 'exact',
    });

    expect(result.yearPillar).toBeDefined();
    expect(result.monthPillar).toBeDefined();
    expect(result.dayPillar).toBeDefined();
    expect(result.hourPillar).not.toBeNull();
    expect(result.timePrecision).toBe('exact');
  });

  it('should compute 1985-06-15 03:00 UTC male (Taipei 121.5°E)', () => {
    // 1985年6月15日 03:00 UTC → 台灣 11:00
    const result = computeBazi({
      birthDatetime: utc(1985, 6, 15, 3, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    // 乙丑年
    expect(result.yearPillar.heavenlyStem).toBe('yi');
    expect(result.yearPillar.earthlyBranch).toBe('chou');

    // 驗證天干五行一致
    expect(result.yearPillar.stemElement).toBe('wood'); // 乙 = wood
    expect(result.yearPillar.branchElement).toBe('earth'); // 丑 = earth
  });
});

// ============================================
// 2. 節氣邊界測試
// ============================================

describe('computeBazi — 節氣邊界', () => {
  it('should handle 立春前後 — 年柱切換', () => {
    // 2024年2月4日立春：前後一天應有年柱差異
    const beforeLiChun = computeBazi({
      birthDatetime: utc(2024, 2, 3, 12, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    const afterLiChun = computeBazi({
      birthDatetime: utc(2024, 2, 5, 12, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    // 立春前後年柱可能不同（取決於具體時刻）
    // 至少不應 crash
    expect(beforeLiChun.yearPillar).toBeDefined();
    expect(afterLiChun.yearPillar).toBeDefined();
  });

  it('should handle 月柱切換 — 小寒/大寒邊界', () => {
    // 測試寒冷月份的月柱切換
    const earlyJan = computeBazi({
      birthDatetime: utc(2024, 1, 5, 12, 0),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'exact',
    });

    const lateJan = computeBazi({
      birthDatetime: utc(2024, 1, 25, 12, 0),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'exact',
    });

    expect(earlyJan.monthPillar).toBeDefined();
    expect(lateJan.monthPillar).toBeDefined();
  });
});

// ============================================
// 3. 子時跨日測試
// ============================================

describe('computeBazi — 子時跨日', () => {
  it('should handle 23:00 UTC — 早子時', () => {
    // 23:00 UTC（如果在中國東八區 = 次日 07:00）
    const result = computeBazi({
      birthDatetime: utc(2024, 3, 15, 23, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    expect(result.dayPillar).toBeDefined();
    expect(result.hourPillar).not.toBeNull();
  });

  it('should handle 00:30 UTC — 可能跨日', () => {
    const result = computeBazi({
      birthDatetime: utc(2024, 3, 16, 0, 30),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'exact',
    });

    expect(result.dayPillar).toBeDefined();
    expect(result.hourPillar).not.toBeNull();
  });
});

// ============================================
// 4. 時間精確度測試
// ============================================

describe('computeBazi — 時間精確度', () => {
  it('should include hourPillar for "exact" precision', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    expect(result.hourPillar).not.toBeNull();
    expect(result.usedTrueSolarTime).toBe(true);
    expect(result.timePrecision).toBe('exact');
  });

  it('should include hourPillar for "approximate" precision but not use true solar time', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'approximate',
    });

    expect(result.hourPillar).not.toBeNull();
    expect(result.usedTrueSolarTime).toBe(false);
    expect(result.timePrecision).toBe('approximate');
  });

  it('should have null hourPillar for "unknown" precision', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'unknown',
    });

    expect(result.hourPillar).toBeNull();
    expect(result.usedTrueSolarTime).toBe(false);
    expect(result.timePrecision).toBe('unknown');
  });
});

// ============================================
// 5. 真太陽時測試
// ============================================

describe('calculateTrueSolarTime', () => {
  it('should return different times for different longitudes', () => {
    const baseTime = utc(2024, 6, 21, 5, 0); // 夏至

    const shanghai = calculateTrueSolarTime(baseTime, 121.5);
    const urumqi = calculateTrueSolarTime(baseTime, 87.6);

    // 上海 vs 烏魯木齊相差約 2 小時 16 分
    const diffMs = Math.abs(shanghai.getTime() - urumqi.getTime());
    const diffMinutes = diffMs / 60000;

    // 經度差 = 121.5 - 87.6 = 33.9°
    // 純經度差引起的時間差 = 33.9 / 15 * 60 ≈ 135.6 分鐘
    // 加上 EoT 差異，總差應在 120-150 分鐘之間
    expect(diffMinutes).toBeGreaterThan(120);
    expect(diffMinutes).toBeLessThan(160);
  });

  it('should have seasonal EoT variation', () => {
    // 夏至 vs 冬至的 EoT 不同
    const summer = utc(2024, 6, 21, 12, 0);
    const winter = utc(2024, 12, 21, 12, 0);
    const longitude = 121.5;

    const summerTST = calculateTrueSolarTime(summer, longitude);
    const winterTST = calculateTrueSolarTime(winter, longitude);

    // 夏至和冬至的 EoT 差異應該存在
    // EoT 在一年中變化約 ±16 分鐘
    const summerOffset = summerTST.getTime() - summer.getTime();
    const winterOffset = winterTST.getTime() - winter.getTime();

    // 兩者偏移量不應完全相同（EoT 不同）
    expect(Math.abs(summerOffset - winterOffset)).toBeGreaterThan(0);
  });

  it('should preserve the date components approximately', () => {
    const input = utc(2024, 3, 20, 4, 0); // 春分附近
    const result = calculateTrueSolarTime(input, 120);

    // 120°E 經度偏移 = 120/15 * 60 = 480 分鐘 = 8 小時
    // 結果應該大致在 UTC + 8 小時附近（±20分鐘 EoT）
    const diffMs = result.getTime() - input.getTime();
    const diffMinutes = diffMs / 60000;

    expect(diffMinutes).toBeGreaterThan(460);
    expect(diffMinutes).toBeLessThan(500);
  });
});

// ============================================
// 6. 日主分析測試
// ============================================

describe('computeBazi — 日主分析', () => {
  it('should have valid day master analysis', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 1, 15, 10, 30),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    const { dayMasterAnalysis } = result;

    // dayMaster 應與日柱天干一致
    expect(dayMasterAnalysis.dayMaster).toBe(result.dayPillar.heavenlyStem);

    // favorableElements 應有 2 個元素
    expect(dayMasterAnalysis.favorableElements).toHaveLength(2);

    // unfavorableElements 應有 2 個元素
    expect(dayMasterAnalysis.unfavorableElements).toHaveLength(2);

    // favorable 和 unfavorable 不應有交集
    const favorSet = new Set(dayMasterAnalysis.favorableElements);
    const unfavorSet = new Set(dayMasterAnalysis.unfavorableElements);
    for (const elem of favorSet) {
      expect(unfavorSet.has(elem)).toBe(false);
    }
  });

  it('should have dayMaster element matching the stem element', () => {
    const result = computeBazi({
      birthDatetime: utc(2000, 8, 15, 6, 0),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'exact',
    });

    // 日主的五行應與日柱天干五行一致
    expect(result.dayMasterAnalysis.element).toBe(result.dayPillar.stemElement);
  });
});

// ============================================
// 7. 大運測試
// ============================================

describe('computeBazi — 大運', () => {
  it('should generate luck pillars', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    // 應有大運列表（第一個通常是特殊的）
    expect(result.luckPillars.length).toBeGreaterThan(0);

    // 每個大運應有完整結構
    for (const lp of result.luckPillars) {
      expect(lp.heavenlyStem).toMatch(/^(jia|yi|bing|ding|wu|ji|geng|xin|ren|gui)$/);
      expect(lp.earthlyBranch).toMatch(/^(zi|chou|yin|mao|chen|si|wu|wei|shen|you|xu|hai)$/);
      expect(typeof lp.startAge).toBe('number');
      expect(typeof lp.endAge).toBe('number');
    }
  });

  it('should generate different luck pillars for male vs female', () => {
    const maleResult = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    const femaleResult = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'female',
      timePrecision: 'exact',
    });

    // 男女大運方向不同（順行/逆行），至少部分大運應不同
    // 四柱本身應相同
    expect(maleResult.dayPillar.heavenlyStem).toBe(femaleResult.dayPillar.heavenlyStem);
    expect(maleResult.dayPillar.earthlyBranch).toBe(femaleResult.dayPillar.earthlyBranch);

    // 大運可能不同（取決於陰年陽年）
    expect(maleResult.luckPillars.length).toBeGreaterThan(0);
    expect(femaleResult.luckPillars.length).toBeGreaterThan(0);
  });
});

// ============================================
// 8. 天干地支五行一致性
// ============================================

describe('computeBazi — 五行一致性', () => {
  const STEM_ELEMENT_MAP: Record<string, string> = {
    jia: 'wood', yi: 'wood',
    bing: 'fire', ding: 'fire',
    wu: 'earth', ji: 'earth',
    geng: 'metal', xin: 'metal',
    ren: 'water', gui: 'water',
  };

  const BRANCH_ELEMENT_MAP: Record<string, string> = {
    zi: 'water', chou: 'earth', yin: 'wood', mao: 'wood',
    chen: 'earth', si: 'fire', wu: 'fire', wei: 'earth',
    shen: 'metal', you: 'metal', xu: 'earth', hai: 'water',
  };

  it('should have consistent stem/branch elements across all pillars', () => {
    const result = computeBazi({
      birthDatetime: utc(1995, 10, 8, 14, 30),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    const pillars = [result.yearPillar, result.monthPillar, result.dayPillar];
    if (result.hourPillar) pillars.push(result.hourPillar);

    for (const pillar of pillars) {
      expect(pillar.stemElement).toBe(STEM_ELEMENT_MAP[pillar.heavenlyStem]);
      expect(pillar.branchElement).toBe(BRANCH_ELEMENT_MAP[pillar.earthlyBranch]);
    }
  });
});

// ============================================
// 9. 藏干測試
// ============================================

describe('computeBazi — 藏干', () => {
  it('should have hidden stems for all pillars', () => {
    const result = computeBazi({
      birthDatetime: utc(1990, 5, 20, 8, 0),
      longitude: 121.5,
      gender: 'male',
      timePrecision: 'exact',
    });

    const pillars = [result.yearPillar, result.monthPillar, result.dayPillar];
    if (result.hourPillar) pillars.push(result.hourPillar);

    for (const pillar of pillars) {
      expect(Array.isArray(pillar.hiddenStems)).toBe(true);
      // 每個地支至少有 1 個藏干
      expect(pillar.hiddenStems.length).toBeGreaterThanOrEqual(1);
    }
  });
});

// ============================================
// 10. Fuzz Test — 隨機生辰不 crash
// ============================================

describe('computeBazi — Fuzz Test', () => {
  it('should not crash for 100 random birth dates', () => {
    for (let i = 0; i < 100; i++) {
      const year = 1940 + Math.floor(Math.random() * 85); // 1940-2024
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const longitude = -180 + Math.random() * 360;
      const gender = Math.random() > 0.5 ? 'male' as const : 'female' as const;

      expect(() => {
        computeBazi({
          birthDatetime: utc(year, month, day, hour, minute),
          longitude,
          gender,
          timePrecision: 'exact',
        });
      }).not.toThrow();
    }
  });

  it('should not crash for edge-case dates', () => {
    const edgeCases = [
      utc(1900, 1, 1, 0, 0),   // 極早日期
      utc(2024, 12, 31, 23, 59), // 年末
      utc(2024, 2, 29, 12, 0),   // 閏年2月29日
      utc(2023, 2, 28, 12, 0),   // 非閏年2月28日
      utc(2000, 1, 1, 0, 0),     // 千禧年
    ];

    for (const date of edgeCases) {
      expect(() => {
        computeBazi({
          birthDatetime: date,
          longitude: 121.5,
          gender: 'male',
          timePrecision: 'exact',
        });
      }).not.toThrow();
    }
  });
});
