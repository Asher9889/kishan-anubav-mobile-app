import { router } from 'expo-router';
import {
  ChevronRight,
  Clock3,
  Leaf,
  MapPin,
  MessageSquareText,
  Mic,
  PencilLine,
  Sprout,
  SunMedium,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Wheat,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import useCurrentWeather from '@/shared/hooks/useCurrentWeather';
import HomeHeader from '../components/HomeHeader';

export default function HomeScreen() {
  const c = Colors.light;
  
  const { isLoading, data: locationData } = useCurrentLocation();
  const { isLoading: isWeatherLoading, data: weatherData } = useCurrentWeather();
  const location = locationData;
  const weather = weatherData;

  return (
    <SafeAreaProvider>
      <View className="flex-1" style={{ backgroundColor: c.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={c.background} />

        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 280 }}
        >
          <View className="px-5 pt-6">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[30px] pt-2 font-extrabold leading-[36px]" style={{ color: c.onSurface }}>
                  नमस्ते, राम सिंह
                </Text>

                <View className="mt-2 flex-row items-center gap-1.5" >
                  <MapPin size={18} color={c.onSurfaceVariant} />
                  <Text className="text-[14px] font-semibold flex-1" style={{ color: c.onSurfaceVariant , flexWrap: 'wrap'}}>
                    {isLoading ? "आपका स्थान लोड हो रहा है..." : `${location?.street}, ${location?.city}, ${location?.region}`}
                  </Text>
                </View>
              </View>

              <View
                className="w-[165px] relative rounded-[20px] border px-4 py-3"
                style={{
                  backgroundColor: c.surfaceContainerLow,
                  borderColor: c.outlineVariant,
                  shadowColor: '#79573F',
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                <Text className="text-[12px] font-medium" style={{ color: c.onSurfaceVariant }}>
                  आज का मौसम
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <View>
                    <Text className="text-[28px] font-bold leading-none" style={{ color: c.primary }}>
                      {isWeatherLoading ? "--°C" : `${weather?.temperature ?? "--"}°C`}
                    </Text>
                    <Text className="mt-1 text-[11px] font-medium" style={{ color: c.secondary }}>
                    {isWeatherLoading ? "--km/h • --%" : `हवा: ${weather?.windSpeed ?? '--'}km/h • नमी: ${weather?.humidity ?? '--'}%`}

                    </Text>
                  </View>

                  <View className="absolute -top-8 -right-2 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(143, 78, 0, 0.08)' }}>
                    <SunMedium size={24} color={c.primary} />
                  </View>
                </View>
              </View>
            </View>

            <SectionHeading
              title="सामुदायिक ज्ञान"
              className="mt-8"
              action={
                <View className="flex-row items-center rounded-full px-4 py-2" style={{ backgroundColor: c.primary }}>
                  <PencilLine size={18} color={c.onPrimary} />
                  <Text className="ml-2 text-[14px] font-semibold" style={{ color: c.onPrimary }}>
                    ज्ञान साझा करें
                  </Text>
                </View>
              }
            />

            <View
              className="mt-4 overflow-hidden rounded-[24px] border p-5"
              style={{
                backgroundColor: '#F8D7BF',
                borderColor: 'rgba(143, 78, 0, 0.08)',
                shadowColor: '#79573F',
                shadowOpacity: 0.08,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 3,
              }}
            >
              <View className="flex-row items-start gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Text className="text-[12px] font-bold" style={{ color: c.primary }}>
                    RS
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-[16px] font-bold" style={{ color: c.onSurface }}>
                    रमेश शर्मा
                  </Text>
                  <View className="mt-0.5 flex-row items-center gap-1.5">
                    <Clock3 size={12} color={c.onSurfaceVariant} />
                    <Text className="text-[11px] font-medium" style={{ color: c.onSurfaceVariant }}>
                      सोनीपत • 2 घंटे पहले
                    </Text>
                  </View>
                </View>

                <View className="h-12 w-12 items-center justify-center rounded-full bg-white/40">
                  <UsersRound size={20} color={c.primary} />
                </View>
              </View>

              <Text className="mt-4 text-[18px] leading-8" style={{ color: c.onSurface }}>
                “एफिड्स के लिए जैविक नीम स्प्रे का इस्तेमाल किया, बिना रसायनों के मेरी सरसों की फसल पर चमत्कार हुआ!”
              </Text>

              <View className="mt-5 flex-row items-center gap-5">
                <View className="flex-row items-center gap-1.5">
                  <ThumbsUp size={18} color={c.onSurface} />
                  <Text className="text-[13px] font-semibold" style={{ color: c.onSurface }}>
                    124
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <MessageSquareText size={18} color={c.onSurface} />
                  <Text className="text-[13px] font-semibold" style={{ color: c.onSurface }}>
                    18
                  </Text>
                </View>
              </View>
            </View>

            <View
              className="mt-4 flex-row items-center gap-4 rounded-[24px] border bg-white p-4"
              style={{
                borderColor: c.outlineVariant,
                shadowColor: '#79573F',
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <View className="flex-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: c.primary }}>
                  नई योजना सूचना
                </Text>
                <Text className="mt-1 pt-2 text-[22px] font-extrabold leading-7" style={{ color: c.onSurface }}>
                  पीएम-किसान 15वीं किस्त जारी
                </Text>
                <Text className="mt-2 text-[14px] leading-6" style={{ color: c.onSurfaceVariant }}>
                  सोनीपत के 15,000+ किसानों के खातों में पैसे पहुंचे।
                </Text>
              </View>

              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop',
                }}
                className="h-[96px] w-[96px] rounded-[18px]"
              />
            </View>

            <SectionHeading
              title="बाजार भाव"
              className="mt-8"
              action={
                <View className="flex-row items-center rounded-full px-3 py-1.5" style={{ backgroundColor: c.surfaceContainerLow }}>
                  <MapPin size={14} color={c.onSurfaceVariant} />
                  <Text className="ml-1.5 text-[12px] font-medium" style={{ color: c.onSurfaceVariant }}>
                    सोनीपत मंडी
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
                note="कल का भाव: ₹2,260"
              />
              <MarketCard
                title="सरसों (Mustard)"
                price="₹5,400"
                delta="-₹40 (क्विंटल)"
                deltaColor={c.error}
                icon={<TrendingDown size={18} color={c.error} />}
                note="कल का भाव: ₹5,440"
              />
            </View>

            <SectionHeading
              title="बीज की कीमत"
              className="mt-8"
              action={
                <Text className="text-[12px] font-medium" style={{ color: c.onSurfaceVariant }}>
                  सरकारी केंद्र • सोनीपत
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
              <SeedRow title="गेहूं (HD-3086)" price="₹3,400" subPrice="/40kg" note="50% सब्सिडी उपलब्ध" />
              <View className="my-3 h-px" style={{ backgroundColor: 'rgba(143, 78, 0, 0.08)' }} />
              <SeedRow title="बाजरा (हाइब्रिड)" price="₹450" subPrice="/1.5kg" note="स्टॉक सीमित" />
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
                    वॉयस असिस्टेंट से पूछें
                  </Text>
                  <Text className="mt-0.5 text-[12px]" style={{ color: c.onSurfaceVariant }}>
                    हिंदी, हरियाणवी या अंग्रेजी
                  </Text>
                </View>
              </View>
              <ChevronRight size={22} color={c.onSurfaceVariant} />
            </Pressable>

            <Pressable
              className="relative mt-8 overflow-hidden rounded-[24px] p-5"
              style={{
                backgroundColor: c.secondaryContainer,
                shadowColor: '#056E00',
                shadowOpacity: 0.12,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 2,
              }}
            >
              <View className="flex-row items-center gap-2">
                <Leaf size={16} color={c.secondary} />
                <Text className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: c.secondary }}>
                  फसल का स्वास्थ्य
                </Text>
              </View>
              <Text className="mt-2 text-[22px] font-extrabold" style={{ color: c.onSurface }}>
                गेहूं: स्वस्थ
              </Text>
              <Text className="mt-1 text-[16px] leading-6" style={{ color: c.onSurfaceVariant }}>
                20 दिनों में कटाई। मिट्टी की नमी अनुकूल है।
              </Text>

              <View className="mt-5 h-2 overflow-hidden rounded-full bg-black/10">
                <View className="h-full w-[84%] rounded-full bg-[#0F5E0A]" />
              </View>

              <View className="absolute -right-1 -bottom-4 opacity-10 rotate-12">
                <Sprout size={110} color={c.onSurface} />
              </View>
            </Pressable>
          </View>
        </ScrollView>

      </View>
    </SafeAreaProvider>
  );
}

function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
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
  icon: ReactNode;
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