-- ============================================
-- Oath — 開發用種子資料
-- ============================================

-- 測試用 system_log 事件
INSERT INTO system_logs (event_type, metadata) VALUES
  ('system_initialized', '{"version": "0.1.0"}'::jsonb);
