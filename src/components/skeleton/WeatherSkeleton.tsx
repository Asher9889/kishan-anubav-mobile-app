import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

export default function WeatherSkeleton() {
  const colors = Colors.light;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const base = { backgroundColor: colors.surfaceContainer, opacity, borderRadius: Radius.sm };

  return (
    <View
      className="rounded-[20px] border px-4 py-4"
      style={{
        backgroundColor: colors.surfaceContainerLow,
        borderColor: colors.outlineVariant,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Animated.View style={[base, { width: 32, height: 32, borderRadius: Radius.full }]} />
          <Animated.View style={[base, { width: 100, height: 14 }]} />
        </View>
        <Animated.View style={[base, { width: 56, height: 22, borderRadius: Radius.full }]} />
      </View>

      <View className="mt-4 flex-row items-baseline gap-1">
        <Animated.View style={[base, { width: 100, height: 40 }]} />
        <Animated.View style={[base, { width: 28, height: 20 }]} />
      </View>

      <View className="mt-4 flex-row items-center gap-5">
        <Animated.View style={[base, { width: 60, height: 16 }]} />
        <Animated.View style={[base, { width: 60, height: 16 }]} />
        <Animated.View style={[base, { width: 70, height: 16 }]} />
      </View>
    </View>
  );
}
