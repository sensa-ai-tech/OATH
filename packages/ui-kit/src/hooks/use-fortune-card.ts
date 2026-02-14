/**
 * 運勢卡片邏輯 Hook — 純邏輯，不含 UI
 * Web 和 Mobile 的 FortuneCard 元件消費此 hook
 */

import { useState, useCallback } from 'react';

export interface FortuneCardState {
  readonly isExpanded: boolean;
  readonly isSharing: boolean;
  readonly toggle: () => void;
  readonly share: () => Promise<void>;
}

export function useFortuneCard(_fortuneId: string): FortuneCardState {
  const [isExpanded, setExpanded] = useState(false);
  const [isSharing, setSharing] = useState(false);

  const toggle = useCallback(() => {
    setExpanded((prev: boolean) => !prev);
  }, []);

  const share = useCallback(async () => {
    setSharing(true);
    try {
      // TODO: Phase 3 — 平台分享 API（Web Share API / expo-sharing）
    } finally {
      setSharing(false);
    }
  }, []);

  return { isExpanded, isSharing, toggle, share };
}
