-- ============================================
-- Oath — 初始資料庫 Schema
-- Phase 0: 基礎表結構 + 索引 + RLS
-- ============================================

-- ============================================
-- profiles（使用者）
-- ============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  -- 不使用 ON DELETE CASCADE，改用 30 天冷卻期硬刪策略
  birth_datetime timestamptz NOT NULL,
  birth_latitude float,
  birth_longitude float,
  birth_timezone text,
  birth_time_precision text DEFAULT 'exact'
    CHECK (birth_time_precision IN ('exact', 'approximate', 'unknown')),
  gender text CHECK (gender IN ('male', 'female')),
  subscription_tier text DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'premium', 'trial')),
  trial_expires_at timestamptz,
  sun_sign text,
  bazi_day_master text,
  locale text DEFAULT 'zh-TW',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  deletion_scheduled_at timestamptz
);

-- ============================================
-- natal_charts（個人命盤）
-- ============================================
CREATE TABLE natal_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  astrology_data jsonb NOT NULL
    CHECK (astrology_data ? 'sun' AND astrology_data ? 'moon' AND astrology_data ? 'ascendant'),
  bazi_data jsonb NOT NULL
    CHECK (bazi_data ? 'yearPillar' AND bazi_data ? 'monthPillar'
           AND bazi_data ? 'dayPillar' AND bazi_data ? 'hourPillar'),
  engine_version text NOT NULL DEFAULT '1.0.0',
  computed_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- ============================================
-- daily_fortunes（每日運勢）
-- ============================================
CREATE TABLE daily_fortunes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  fortune_date date NOT NULL,
  astrology_transit jsonb,
  bazi_day_analysis jsonb,
  template_id text,
  template_message text NOT NULL,
  polished_message text,
  action_suggestion text NOT NULL,
  share_card_url text,
  llm_tokens_input int DEFAULT 0,
  llm_tokens_output int DEFAULT 0,
  llm_model text,
  llm_cost_usd numeric(10,6) DEFAULT 0,
  engine_version text NOT NULL DEFAULT '1.0.0',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, fortune_date)
);

-- ============================================
-- interactive_readings（Phase 2+）
-- ============================================
CREATE TABLE interactive_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  reading_type text CHECK (reading_type IN ('tarot', 'iching')),
  input_data jsonb,
  result_data jsonb,
  guidance_text text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- system_logs（結構化 logging）
-- ============================================
CREATE TABLE system_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid REFERENCES profiles(id),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_deletion_scheduled ON profiles(deletion_scheduled_at)
  WHERE deletion_scheduled_at IS NOT NULL;

CREATE INDEX idx_natal_charts_user_id ON natal_charts(user_id);

CREATE INDEX idx_daily_fortunes_user_date ON daily_fortunes(user_id, fortune_date DESC);
CREATE INDEX idx_daily_fortunes_date ON daily_fortunes(fortune_date);
CREATE INDEX idx_daily_fortunes_engine_version ON daily_fortunes(engine_version);

CREATE INDEX idx_interactive_readings_user_id ON interactive_readings(user_id, created_at DESC);

CREATE INDEX idx_system_logs_event_type ON system_logs(event_type, created_at DESC);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id, created_at DESC);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE natal_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fortunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- profiles: 使用者只能讀寫自己的資料，且不能存取 soft-deleted 帳號
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id AND deleted_at IS NULL);

-- natal_charts: 使用者只能讀自己的命盤
CREATE POLICY "Users can view own natal chart"
  ON natal_charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own natal chart"
  ON natal_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own natal chart"
  ON natal_charts FOR UPDATE
  USING (auth.uid() = user_id);

-- daily_fortunes: 使用者只能讀自己的運勢
CREATE POLICY "Users can view own fortunes"
  ON daily_fortunes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fortunes"
  ON daily_fortunes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- interactive_readings: 使用者只能讀寫自己的互動記錄
CREATE POLICY "Users can view own readings"
  ON interactive_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings"
  ON interactive_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- system_logs: 僅服務端（service_role）可寫入
CREATE POLICY "Service role can manage system logs"
  ON system_logs FOR ALL
  USING (auth.role() = 'service_role');
