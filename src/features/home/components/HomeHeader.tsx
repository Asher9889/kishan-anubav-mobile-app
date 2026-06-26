import { router } from 'expo-router';
import { CircleUserRound } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { Logo } from '@/components';
import { Colors, Typography } from '@/constants/theme';

export default function HomeHeader() {
  const colors = Colors.light;

  return (
    <View
      style={{ backgroundColor: colors.primaryContainer }}
      className="px-5"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Logo width={44} height={44} />
          <Text style={[Typography.h3, { color: colors.onPrimary }]}>
            Krishi Anubhav AI
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(private)/(stack)/client-profile')}
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          <CircleUserRound color={colors.onPrimary} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}