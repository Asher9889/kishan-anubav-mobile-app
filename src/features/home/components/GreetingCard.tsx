import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

interface GreetingCardProps {
  userName?: string | null;
  location?: string | null;
}

export default function GreetingCard({ userName, location }: GreetingCardProps) {
  const { t } = useTranslation('common');
  const c = Colors.light;

  return (
    <Animated.View
      entering={FadeInDown.duration(500).damping(20).stiffness(120)}
    >
      <Text
        className="text-[26px] font-extrabold leading-[34px]"
        style={{ color: c.onSurface }}
      >
        {t('home.greeting')},{' '}
        <Text style={{ color: c.primary }}>
          {userName || t('home.farmer')}
        </Text>
        !
      </Text>

      {location ? (
        <Animated.View
          entering={FadeInDown.duration(400).damping(20).delay(120)}
          className="mt-3 flex-row items-center gap-2"
        >
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(143, 78, 0, 0.10)' }}
          >
            <MapPin size={13} color={c.primary} />
          </View>
          <Text
            className="flex-1 text-[14px] font-semibold leading-[20px]"
            style={{ color: c.textSecondary }}
            numberOfLines={1}
          >
            {location}
          </Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
