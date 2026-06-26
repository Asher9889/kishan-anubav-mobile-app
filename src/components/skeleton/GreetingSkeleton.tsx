import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function GreetingSkeleton() {
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

  const skeletonBg = { backgroundColor: colors.surfaceContainer, opacity };

  return (
    <View className="flex-1">
      <Animated.View
        style={[skeletonBg, { width: '75%', height: 28, borderRadius: 8 }]}
      />
      <View className="mt-3 flex-row items-center gap-2">
        <Animated.View
          style={[skeletonBg, { width: 18, height: 18, borderRadius: 9 }]}
        />
        <Animated.View
          style={[skeletonBg, { width: '60%', height: 16, borderRadius: 8 }]}
        />
      </View>
    </View>
  );
}
