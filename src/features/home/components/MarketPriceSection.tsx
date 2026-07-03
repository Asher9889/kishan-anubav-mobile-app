import { ChevronRight, MapPin, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { ILocationData } from '@/shared/types/types';
import SectionHeading from './SectionHeading';

function MarketCard({
  title,
  price,
  delta,
  deltaColor,
  icon,
  note,
}: {
  title: string;
  price: string;
  delta: string;
  deltaColor: string;
  icon: React.ReactNode;
  note: string;
}) {
  const c = Colors.light;

  return (
    <View
      className="flex-1 rounded-[20px] border bg-white p-4"
      style={{
        borderColor: c.borderLight,
        shadowColor: '#79573F',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between">
        <Text className="text-[13px] font-semibold" style={{ color: c.onSurfaceVariant }}>
          {title}
        </Text>
        {icon}
      </View>

      <Text className="mt-2 text-[24px] font-extrabold" style={{ color: c.onSurface }}>
        {price}
      </Text>

      <Text className="mt-1 text-[12px] font-medium" style={{ color: deltaColor }}>
        {delta}
      </Text>

      <Text className="mt-3 text-center text-[10px] italic" style={{ color: c.onSurfaceVariant }}>
        {note}
      </Text>
    </View>
  );
}

interface Props {
  onSeeAll?: () => void;
  location?: ILocationData;
}

export default function MarketPriceSection({ onSeeAll, location }: Props) {
  console.log('Current location:', location); // Debugging line
  const { t } = useTranslation('common');
  const c = Colors.light;

  return (
    <>
      <SectionHeading
        title={t('home.marketPrice')}
        className="mt-8"
        action={
          <View className="flex-row items-center rounded-full px-3 py-1.5" style={{ backgroundColor: c.surfaceContainerLow }}>
            <MapPin size={14} color={c.onSurfaceVariant} />
            <Text className="ml-1.5 text-[12px] font-medium" style={{ color: c.onSurfaceVariant }}>
              {location?.city || ''} {t('home.marketPrice')}
            </Text> 
          </View>
        }
      />

      <View className="mt-4 flex-row gap-3">
        <MarketCard
          title="गेहूं (Wheat)"
          price="₹2,275"
          delta="+₹15 (क्विंटल)"
          deltaColor={c.secondary}
          icon={<TrendingUp size={18} color={c.secondary} />}
          note={t('home.yesterdayPrice', { price: '₹2,260' })}
        />
        <MarketCard
          title="सरसों (Mustard)"
          price="₹5,400"
          delta="-₹40 (क्विंटल)"
          deltaColor={c.error}
          icon={<TrendingDown size={18} color={c.error} />}
          note={t('home.yesterdayPrice', { price: '₹5,440' })}
        />
      </View>

      {onSeeAll && (
        <Pressable
          onPress={onSeeAll}
          className="mt-3 flex-row items-center justify-center gap-1 py-2"
        >
          <Text className="text-[14px] font-semibold" style={{ color: c.primary }}>
            {t('home.seeAll')}
          </Text>
          <ChevronRight size={16} color={c.primary} />
        </Pressable>
      )}
    </>
  );
}
