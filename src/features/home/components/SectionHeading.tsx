import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

interface Props {
  title: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({ title, action, className }: Props) {
  const c = Colors.light;

  return (
    <View className={`flex-row items-center justify-between ${className ?? ''}`}>
      <Text className="text-[24px] font-extrabold" style={{ color: c.onSurface }}>
        {title}
      </Text>
      {action}
    </View>
  );
}
