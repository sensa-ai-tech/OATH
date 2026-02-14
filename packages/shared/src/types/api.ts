/**
 * API v1 Request/Response 型別定義
 */

import type { BirthTimePrecision, Gender, Locale } from './user.js';
import type { NatalChart } from './natal-chart.js';
import type { DailyFortune, DailyFortuneSummary } from './daily-fortune.js';

// ============================================
// Auth
// ============================================

export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly birthDatetime: string;
  readonly birthLatitude?: number;
  readonly birthLongitude?: number;
  readonly birthTimezone: string;
  readonly birthTimePrecision: BirthTimePrecision;
  readonly gender?: Gender;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly user: {
    readonly id: string;
    readonly email: string;
  };
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

// ============================================
// Natal Chart
// ============================================

export interface ComputeNatalChartResponse {
  readonly chart: NatalChart;
  /** 部分失敗時的警告訊息 */
  readonly warnings?: readonly string[];
}

// ============================================
// Daily Fortune
// ============================================

export interface GetDailyFortuneRequest {
  /** YYYY-MM-DD 格式 */
  readonly date: string;
}

export interface GetDailyFortuneRangeRequest {
  /** YYYY-MM-DD 格式 */
  readonly from: string;
  /** YYYY-MM-DD 格式 */
  readonly to: string;
}

export interface GetDailyFortuneResponse {
  readonly fortune: DailyFortune;
}

export interface GetDailyFortuneRangeResponse {
  readonly fortunes: readonly DailyFortuneSummary[];
  readonly total: number;
}

// ============================================
// Profile
// ============================================

export interface UpdateProfileRequest {
  readonly locale?: Locale;
}

export interface UpdateBirthDataRequest {
  readonly birthDatetime?: string;
  readonly birthLatitude?: number;
  readonly birthLongitude?: number;
  readonly birthTimezone?: string;
  readonly birthTimePrecision?: BirthTimePrecision;
  readonly gender?: Gender;
}

// ============================================
// Share Card
// ============================================

export interface ShareCardResponse {
  /** IG Story 尺寸 (1080x1920) */
  readonly storyUrl: string;
  /** 預覽尺寸 (1200x630) */
  readonly previewUrl: string;
}

// ============================================
// 通用
// ============================================

/** API 成功回應包裝 */
export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly requestId: string;
}

/** API 錯誤回應 */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly requestId: string;
  readonly timestamp: string;
}

/** API 回應聯合型別 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
