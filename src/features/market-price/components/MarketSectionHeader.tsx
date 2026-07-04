import { MapPin } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

interface Props {
  title: string;
  location: string;
}

export default function MarketSectionHeader({
  title,
  location,
}: Props) {
  const c = Colors.light;

  return (
    <View className="mb-5 flex-row items-center justify-between px-5">
      {/* Left */}

      <View>
        <Text
          className="text-[22px] font-bold"
          style={{
            color: c.onSurface,
          }}
        >
          {title}
        </Text>

        <Text
          className="mt-1 text-[13px]"
          style={{
            color: c.onSurfaceVariant,
          }}
        >
          Today's Mandi Prices
        </Text>
      </View>

      {/* Right */}

      <View
        className="flex-row items-center rounded-full px-3 py-2"
        style={{
          backgroundColor: c.surfaceContainerLow,
        }}
      >
        <MapPin
          size={15}
          color={c.primary}
        />

        <Text
          className="ml-2 text-[12px] font-semibold"
          style={{
            color: c.primary,
          }}
        >
          {location}
        </Text>
      </View>
    </View>
  );
}