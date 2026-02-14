/**
 * 使用者相關型別定義
 */

/** 出生時間精確度 */
export type BirthTimePrecision = 'exact' | 'approximate' | 'unknown';

/** 性別（八字排盤用） */
export type Gender = 'male' | 'female';

/** 訂閱層級 */
export type SubscriptionTier = 'free' | 'premium' | 'trial';

/** 支援的語系 */
export type Locale = 'zh-TW' | 'en';

/** 使用者出生資料 */
export interface BirthData {
  /** ISO 8601 格式的出生日期時間 */
  readonly birthDatetime: string;
  /** 出生地緯度 */
  readonly birthLatitude?: number;
  /** 出生地經度 */
  readonly birthLongitude?: number;
  /** 出生地時區（IANA 格式，如 Asia/Taipei） */
  readonly birthTimezone: string;
  /** 出生時間精確度 */
  readonly birthTimePrecision: BirthTimePrecision;
  /** 性別 */
  readonly gender?: Gender;
}

/** 使用者個人檔案 */
export interface UserProfile extends BirthData {
  readonly id: string;
  readonly email: string;
  /** 訂閱層級 */
  readonly subscriptionTier: SubscriptionTier;
  /** 試用期到期時間（ISO 8601） */
  readonly trialExpiresAt?: string;
  /** 太陽星座（英文小寫） */
  readonly sunSign?: string;
  /** 八字日主（天干英文） */
  readonly baziDayMaster?: string;
  /** 使用者語系 */
  readonly locale: Locale;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** soft delete 時間戳 */
  readonly deletedAt?: string;
  /** 預定硬刪時間（30 天冷卻期後） */
  readonly deletionScheduledAt?: string;
}
