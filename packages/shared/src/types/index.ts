/**
 * 型別統一匯出
 */

// User types
export type {
  BirthTimePrecision,
  Gender,
  SubscriptionTier,
  Locale,
  BirthData,
  UserProfile,
} from './user.js';

// Natal Chart types
export type {
  ZodiacSign,
  Planet,
  AspectType,
  PlanetPosition,
  AspectData,
  AstrologyData,
  HeavenlyStem,
  EarthlyBranch,
  WuXing,
  TenGod,
  Pillar,
  LuckPillar,
  DayMasterAnalysis,
  BaziData,
  NatalChart,
} from './natal-chart.js';

// Daily Fortune types
export type {
  DailyTransit,
  TransitEvent,
  DailyBaziAnalysis,
  DailyFortune,
  DailyFortuneSummary,
} from './daily-fortune.js';

// API types
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  ComputeNatalChartResponse,
  GetDailyFortuneRequest,
  GetDailyFortuneRangeRequest,
  GetDailyFortuneResponse,
  GetDailyFortuneRangeResponse,
  UpdateProfileRequest,
  UpdateBirthDataRequest,
  ShareCardResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
} from './api.js';

// Error types
export type { ApiError, ErrorCode } from './errors.js';
export { ERROR_CODES, createApiError } from './errors.js';
