import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloudRain,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import type { IWeatherData } from '@/shared/types/types';

interface WeatherCardProps {
  weather: IWeatherData;
}

type Condition = 'rainy' | 'hot' | 'clear';

function getCondition(weather: IWeatherData): Condition {
  if (weather.rain > 0) return 'rainy';
  if (weather.temperature >= 35) return 'hot';
  return 'clear';
}

const config: Record<Condition, { Icon: typeof Sun; bg: string; accent: string; ring: string }> = {
  clear: {
    Icon: Sun,
    bg: '#FFF8F0',
    accent: '#8F4E00',
    ring: 'rgba(143, 78, 0, 0.10)',
  },
  hot: {
    Icon: Thermometer,
    bg: '#FFF0E6',
    accent: '#C2410C',
    ring: 'rgba(194, 65, 12, 0.12)',
  },
  rainy: {
    Icon: CloudRain,
    bg: '#F0F4F8',
    accent: '#3B6E9F',
    ring: 'rgba(59, 110, 159, 0.10)',
  },
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useTranslation('common');
  const c = Colors.light;
  const condition = useMemo(() => getCondition(weather), [weather]);
  const { Icon, bg, accent, ring } = config[condition];

  const pulse = useSharedValue(1);
  pulse.value = withRepeat(
    withSequence(
      withTiming(1.12, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
    ),
    -1,
    true,
  );

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const metricIcon = (icon: React.ReactNode, label: string) => (
    <View className="flex-row items-center gap-1">
      {icon}
      <Text className="text-[13px] font-semibold" style={{ color: c.onSurfaceVariant }}>
        {label}
      </Text>
    </View>
  );

  return (
    <Animated.View
      key={condition}
      entering={FadeIn.duration(400)}
      className="rounded-[20px] border px-4 py-4"
      style={{
        backgroundColor: bg,
        borderColor: `${accent}18`,
        shadowColor: accent,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Animated.View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={[iconAnim, { backgroundColor: ring }]}
          >
            <Icon size={16} color={accent} />
          </Animated.View>
          <Text className="text-[13px] font-semibold" style={{ color: accent }}>
            {t('home.todayWeather')}
          </Text>
        </View>

        <View
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: `${accent}10` }}
        >
          <Text className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: accent }}>
            {condition === 'rainy' ? t('home.rain') : `${weather.temperature}°C`}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-baseline gap-1">
        <Text className="text-[40px] font-bold leading-none" style={{ color: c.onSurface }}>
          {weather.temperature}
        </Text>
        <Text className="text-[20px] font-semibold leading-none" style={{ color: accent }}>
          °C
        </Text>
      </View>

      <View className="mt-4 flex-row items-center gap-5">
        {metricIcon(
          <Droplets size={15} color={c.secondary} />,
          `${weather.humidity}%`,
        )}
        {metricIcon(
          <CloudRain size={15} color={accent} />,
          `${weather.rain}mm`,
        )}
        {weather.windSpeed != null &&
          metricIcon(
            <Wind size={15} color={c.onSurfaceVariant} />,
            `${weather.windSpeed}km/h`,
          )}
      </View>
    </Animated.View>
  );
}
