import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@oath/shared/design-tokens';

/**
 * Mobile App 入口 — Phase 3d 實作完整 UI
 * 目前為骨架，確認 build 通過即可
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oath</Text>
      <Text style={styles.subtitle}>Mobile App — Phase 3d</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: '700',
    color: colors.brand.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    marginTop: 16,
  },
});
