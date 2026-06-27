import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

export default function FeedSkeleton() {
  const colors = Colors.light;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const base = { backgroundColor: colors.surfaceContainer, opacity, borderRadius: Radius.md };

  const card = () => (
    <>
      <View style={styles.card}>
        <View style={styles.paddedSection}>
          <View style={styles.header}>
            <Animated.View style={[base, styles.avatar]} />
            <View style={styles.headerText}>
              <Animated.View style={[base, { width: '60%', height: 16 }]} />
              <Animated.View style={[base, { width: '40%', height: 12, marginTop: 6 }]} />
            </View>
          </View>
          <Animated.View style={[base, { width: '100%', height: 14, marginTop: 14 }]} />
          <Animated.View style={[base, { width: '90%', height: 14, marginTop: 8 }]} />
          <Animated.View style={[base, { width: '75%', height: 14, marginTop: 8 }]} />
        </View>
        <Animated.View style={[base, { width: '100%', aspectRatio: 4 / 5 }]} />
        <View style={styles.paddedSection}>
          <View style={styles.actionRow}>
            {[1, 2, 3].map((i) => (
              <Animated.View key={i} style={[base, { flex: 1, height: 36, marginHorizontal: 4 }]} />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </>
  );

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i}>{card()}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.light.card,
  },
  paddedSection: {
    paddingHorizontal: Spacing.md,
  },
  separator: {
    height: 2,
    backgroundColor: Colors.light.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.borderLight,
  },
});
