import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors, Spacing, Typography } from '@/constants/theme';

import { PROFILE_TABS } from '../constants/profile.constants';
import type { ProfileTabKey } from '../types/profile.types';

type AppTheme = typeof Colors.light;

type ProfileTabsProps = {
  theme: AppTheme;
  value: ProfileTabKey;
  onChange: (tab: ProfileTabKey) => void;
};

type LayoutMap = Record<ProfileTabKey, { x: number; width: number }>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ProfileTabsComponent = ({ theme, value, onChange }: ProfileTabsProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const layoutsRef = useRef<Partial<LayoutMap>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const layout = layoutsRef.current[value];

    if (!layout) return;

    indicatorX.value = withSpring(layout.x + 0, { damping: 16, stiffness: 180 });
    indicatorWidth.value = withSpring(layout.width, { damping: 16, stiffness: 180 });
  }, [value, indicatorX, indicatorWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    opacity: ready ? 1 : 0,
  }));

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.row}>
        {PROFILE_TABS.map((tab) => {
          const isActive = tab.key === value;

          return (
            <AnimatedPressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                layoutsRef.current[tab.key] = { x, width };

                if (tab.key === value) {
                  indicatorX.value = x;
                  indicatorWidth.value = width;
                  setReady(true);
                }
              }}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>{tab.label}</Text>
            </AnimatedPressable>
          );
        })}
      </View>

      <Animated.View pointerEvents="none" style={[styles.indicator, animatedIndicatorStyle]} />
    </View>
  );
};

export const ProfileTabs = memo(ProfileTabsComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
    },
    label: {
      fontSize: Typography.body.fontSize,
      fontWeight: '700',
    },
    labelActive: {
      color: theme.text,
    },
    labelInactive: {
      color: theme.textMuted,
    },
    indicator: {
      height: 2,
      backgroundColor: theme.text,
      marginTop: 6,
      borderRadius: 2,
      position: 'absolute',
      left: 0,
      bottom: 0,
    },
  });

export { ProfileTabsComponent };
