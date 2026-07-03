import { router } from 'expo-router';
import {
  ChevronRight,
  Mic,
  PencilLine,
  Wheat
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GreetingSkeleton from '@/components/skeleton/GreetingSkeleton';
import WeatherSkeleton from '@/components/skeleton/WeatherSkeleton';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/features/auth/store/auth.store';
import HomePageMarketPriceSection from '@/features/market/screen/HomePageMarketPriceSection';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import useCurrentWeather from '@/shared/hooks/useCurrentWeather';
import FeaturedKnowledgeCard from '../components/FeaturedKnowledgeCard';
import GreetingCard from '../components/GreetingCard';
import HomeHeader from '../components/HomeHeader';
import ImageCorousal from '../components/ImageCorousal';
import SectionHeading from '../components/SectionHeading';
import WeatherCard from '../components/WeatherCard';
import useFeaturedKnowledge from '../hooks/useFeaturedKnowledge';
import useNews from '../hooks/useNews';
import type { FeaturedPostResponse } from '../types/types';

export default function HomeScreen() {
  const { t } = useTranslation('common');
  const c = Colors.light;

  const user = useAuthStore((state) => state.user);
  const { isLoading: isLoadingLocation, data: locationData } = useCurrentLocation();
  const { isLoading: isWeatherLoading, data: weatherData } = useCurrentWeather();
  const location = locationData;
  const weather = weatherData;

  const { data: newsData, isLoading: isLoadingNews, } = useNews();
  const { data: featuredKnowledge, isLoading: isLoadingFeaturedKnowledge } = useFeaturedKnowledge();

  return (

    <SafeAreaView className="flex-1" style={{ backgroundColor: c.primaryContainer }}>
      <StatusBar backgroundColor={c.primaryContainer} />
      <View style={{ backgroundColor: c.background }}>

        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="px-5 pt-2">
            <View className="gap-6">
              <View>
                {isLoadingLocation ? (
                  <GreetingSkeleton />
                ) : (
                  <GreetingCard
                    userName={user?.fullName}
                    location={location ? `${location.street}, ${location.city}, ${location.region}` : ""}
                  />
                )}
              </View>

              {!isLoadingLocation && isWeatherLoading ? (
                <WeatherSkeleton />
              ) : weather ? (
                <WeatherCard weather={weather} />
              ) : null}
            </View>

            <SectionHeading
              title={t('home.communityKnowledge')}
              className="mt-8"
              action={
                <Pressable onPress={() => router.push("/(private)/(stack)/knowledge/create")}>
                  <View className="flex-row items-center rounded-full px-4 py-2" style={{ backgroundColor: c.primary }}>
                    <PencilLine size={18} color={c.onPrimary} />
                    <Text className="ml-2 text-[14px] font-semibold" style={{ color: c.onPrimary }}>
                      {t('home.shareKnowledge')}
                    </Text>
                  </View>
                </Pressable>
              }
            />

            <FeaturedKnowledge knowledge={featuredKnowledge?.data} isLoading={isLoadingFeaturedKnowledge} />


            {
              !isLoadingNews && Array.isArray(newsData) && newsData.length > 0 &&
              <ImageCorousal news={newsData} />
            }

            <HomePageMarketPriceSection />
          

            <SectionHeading
              title={t('home.seedPrice')}
              className="mt-8"
              action={
                <Text className="text-[12px] font-medium" style={{ color: c.onSurfaceVariant }}>
                  {t('home.seedPrice')} • सोनीपत
                </Text>
              }
            />

            <View
              className="mt-4 rounded-[24px] border p-4"
              style={{
                backgroundColor: c.primaryLight,
                borderColor: 'rgba(143, 78, 0, 0.08)',
                shadowColor: '#79573F',
                shadowOpacity: 0.06,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 2,
              }}
            >
              <SeedRow title="गेहूं (HD-3086)" price="₹3,400" subPrice="/40kg" note={t('home.subsidyAvailable')} />
              <View className="my-3 h-px" style={{ backgroundColor: 'rgba(143, 78, 0, 0.08)' }} />
              <SeedRow title="बाजरा (हाइब्रिड)" price="₹450" subPrice="/1.5kg" note={t('home.stockLimited')} />
            </View>

            <Pressable
              onPress={() => router.push("/(private)/ai-chat")}
              className="mt-8 flex-row items-center justify-between rounded-[24px] border bg-white px-5 py-5"
              style={{
                borderColor: c.borderLight,
                shadowColor: '#79573F',
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255, 153, 51, 0.18)' }}>
                  <Mic size={24} color={c.primaryContainer} />
                </View>
                <View>
                  <Text className="text-[18px] font-bold" style={{ color: c.onSurface }}>
                    {t('home.voiceAssistant')}
                  </Text>
                  <Text className="mt-0.5 text-[12px]" style={{ color: c.onSurfaceVariant }}>
                    {t('home.voiceAssistantHint')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={22} color={c.onSurfaceVariant} />
            </Pressable>

          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

function FeaturedKnowledge({
  knowledge,
  isLoading,
}: {
  knowledge: FeaturedPostResponse['data'] | undefined;
  isLoading: boolean;
}) {
  const c = Colors.light;

  if (isLoading) {
    return (
      <View className="mt-4 h-[200px] items-center justify-center rounded-[24px]"
        style={{ backgroundColor: '#F8D7BF' }}
      >
        <ActivityIndicator size="small" color={c.primary} />
      </View>
    );
  }

  if (!knowledge) return null;

  return <FeaturedKnowledgeCard data={knowledge} />;
}

function SeedRow({
  title,
  price,
  subPrice,
  note,
}: {
  title: string;
  price: string;
  subPrice: string;
  note: string;
}) {
  const c = Colors.light;

  return (
    <View className="flex-row items-center justify-between rounded-[18px] bg-white/75 px-4 py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFF2E6]">
          <Wheat size={18} color={c.primary} />
        </View>
        <Text className="text-[16px] font-bold" style={{ color: c.onSurface }}>
          {title}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-[16px] font-bold" style={{ color: c.primary }}>
          {price} <Text className="text-[11px] font-medium" style={{ color: c.onSurfaceVariant }}>{subPrice}</Text>
        </Text>
        <Text className="text-[11px] font-semibold" style={{ color: c.secondary }}>
          {note}
        </Text>
      </View>
    </View>
  );
}