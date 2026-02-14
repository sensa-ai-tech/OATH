/**
 * API 錯誤碼與錯誤型別定義
 */

/** API 錯誤介面 */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly requestId: string;
  readonly timestamp: string;
}

/** 錯誤碼清單 */
export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_SESSION_EXPIRED: 'AUTH_002',
  AUTH_ACCOUNT_DELETED: 'AUTH_003',
  AUTH_ACCOUNT_PENDING_DELETION: 'AUTH_004',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_005',

  // Validation
  VALIDATION_INVALID_BIRTH_DATA: 'VAL_001',
  VALIDATION_INVALID_DATE_RANGE: 'VAL_002',
  VALIDATION_MISSING_REQUIRED_FIELD: 'VAL_003',
  VALIDATION_INVALID_FORMAT: 'VAL_004',

  // Engine
  ENGINE_COMPUTATION_FAILED: 'ENG_001',
  ENGINE_TIMEOUT: 'ENG_002',
  ENGINE_WASM_LOAD_FAILED: 'ENG_003',
  ENGINE_EPHEMERIS_ERROR: 'ENG_004',
  ENGINE_PARTIAL_FAILURE: 'ENG_005',

  // Content
  CONTENT_TEMPLATE_NOT_FOUND: 'CNT_001',
  CONTENT_LLM_UNAVAILABLE: 'CNT_002',
  CONTENT_SAFETY_FILTER_TRIGGERED: 'CNT_003',
  CONTENT_GENERATION_FAILED: 'CNT_004',

  // Rate Limit
  RATE_LIMIT_EXCEEDED: 'RTE_001',

  // General
  INTERNAL_SERVER_ERROR: 'GEN_001',
  NOT_FOUND: 'GEN_002',
  FORBIDDEN: 'GEN_003',
  METHOD_NOT_ALLOWED: 'GEN_004',
} as const;

/** 錯誤碼型別 */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** 建立 ApiError 的工廠函式 */
export function createApiError(
  code: ErrorCode,
  message: string,
  requestId: string,
  details?: Record<string, unknown>,
): ApiError {
  return {
    code,
    message,
    details,
    requestId,
    timestamp: new Date().toISOString(),
  };
}
