import {
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  RefreshCw,
  Store,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { ILocationData } from "@/shared/types/types";

interface Props {
  location?: ILocationData;
  onSeeAll?: () => void;
  onUpdate?: () => void;
}

const CROP_DATA = [
  {
    id: "1",
    cropName: "गेहूं",
    englishName: "Wheat",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300",
    modalPrice: 2275,
    previousPrice: 2260,
    minPrice: 2120,
    maxPrice: 2420,
    trend: "up" as const,
  },
  {
    id: "2",
    cropName: "सरसों",
    englishName: "Mustard",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300",
    modalPrice: 5400,
    previousPrice: 5440,
    minPrice: 5150,
    maxPrice: 5760,
    trend: "down" as const,
  },
];

const CARD_WIDTH = 300;

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function MarketPriceCard({ crop, c, t }: {
  crop: (typeof CROP_DATA)[number];
  c: typeof Colors.light;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const difference = crop.modalPrice - crop.previousPrice;
  const percentage = ((difference / crop.previousPrice) * 100).toFixed(2);
  const isUp = crop.trend === "up";

  return (
    <View
      style={{
        width: CARD_WIDTH,
        backgroundColor: c.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.borderLight,
        padding: 20,
      }}
    >
      {/* Top Row */}
      <View className="flex-row items-center justify-between">
        {/* Image + Name */}
        <View className="flex-row flex-1 items-center">
          <View
            className="items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: c.surfaceContainerLow,
            }}
          >
            <Image
              source={{ uri: crop.image }}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>
          <View className="ml-3 flex-shrink">
            <Text
              className="text-[20px] font-semibold"
              style={{ color: c.onSurface }}
            >
              {crop.cropName}
            </Text>
            <Text
              className="mt-1 text-[16px]"
              style={{ color: c.onSurfaceVariant }}
            >
              ({crop.englishName})
            </Text>
          </View>
        </View>

        {/* Trend Badge */}
        <View
          className="items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: isUp ? c.successLight : c.errorLight,
          }}
        >
          {isUp ? (
            <TrendingUp size={24} color={c.secondary} />
          ) : (
            <TrendingDown size={24} color={c.error} />
          )}
        </View>
      </View>

      {/* Price */}
      <Text
        className="mt-3 text-[42px] font-extrabold"
        style={{ color: c.onSurface }}
      >
        {formatPrice(crop.modalPrice)}
      </Text>

      {/* Change Row */}
      <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
        <Text
          className="text-[16px] font-semibold"
          style={{ color: isUp ? c.secondary : c.error }}
        >
          {difference > 0 ? "+" : ""}₹{Math.abs(difference)} (
          {t("home.perQuintal")})
        </Text>
        <View
          className="rounded-lg px-3 py-1.5"
          style={{
            backgroundColor: isUp ? c.successLight : c.errorLight,
          }}
        >
          <Text
            className="text-[14px] font-medium"
            style={{ color: isUp ? c.secondary : c.error }}
          >
            {difference > 0 ? "+" : ""}
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        className="my-4 h-px"
        style={{ backgroundColor: c.borderLight }}
      />

      {/* Metadata Row */}
      <View className="flex-row items-center">
        <View className="flex-1 items-center">
          <Text className="text-[13px]" style={{ color: c.onSurfaceVariant }}>
            {t("home.minPrice")}
          </Text>
          <Text
            className="mt-0.5 text-[13px] font-medium"
            style={{ color: c.onSurfaceVariant }}
          >
            {formatPrice(crop.minPrice)}
          </Text>
        </View>
        <View
          style={{ width: 1, height: 32, backgroundColor: c.borderLight }}
        />
        <View className="flex-1 items-center">
          <Text className="text-[13px]" style={{ color: c.onSurfaceVariant }}>
            {t("home.maxPrice")}
          </Text>
          <Text
            className="mt-0.5 text-[13px] font-medium"
            style={{ color: c.onSurfaceVariant }}
          >
            {formatPrice(crop.maxPrice)}
          </Text>
        </View>
        <View
          style={{ width: 1, height: 32, backgroundColor: c.borderLight }}
        />
        <View className="flex-1 items-center">
          <Text className="text-[13px]" style={{ color: c.onSurfaceVariant }}>
            {t("home.yesterdaysPrice")}
          </Text>
          <Text
            className="mt-0.5 text-[13px] font-medium"
            style={{ color: c.onSurfaceVariant }}
          >
            {formatPrice(crop.previousPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function HomePageMarketPriceSection({
  location,
  onSeeAll,
  onUpdate,
}: Props) {
  const { t } = useTranslation("common");
  const c = Colors.light;

  return (
    <View>
      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: 24 }}
      >
        <View>
          <Text
            className="text-[28px] font-extrabold"
            style={{ color: c.onSurface }}
          >
            {t("home.marketPrice")}
          </Text>
          <Text
            className="mt-1 text-[16px]"
            style={{ color: c.onSurfaceVariant }}
          >
            {t("home.marketPriceSubtitle")}
          </Text>
        </View>

        {/* Location Pill */}
        <Pressable
          className="flex-row items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: c.surfaceContainerLow,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: c.borderLight,
            paddingVertical: 12,
            paddingHorizontal: 16,
          })}
        >
          <MapPin size={20} color={c.primary} />
          <View className="ml-2">
            <Text className="text-[12px]" style={{ color: c.onSurfaceVariant }}>
              {t("home.yourLocation")}
            </Text>
            <Text
              className="text-[14px] font-semibold"
              style={{ color: c.onSurface }}
            >
              {location
                ? `${location.city}, ${location.region}`
                : t("home.loadingLocation")}
            </Text>
          </View>
          <ChevronDown
            size={16}
            color={c.onSurfaceVariant}
            style={{ marginLeft: 8 }}
          />
        </Pressable>
      </View>

      {/* Horizontal Card Carousel */}
      <FlatList
        horizontal
        data={CROP_DATA}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <MarketPriceCard crop={item} c={c} t={t} />
        )}
      />

      {/* View All Button */}
      <Pressable
        onPress={onSeeAll}
        className="flex-row items-center justify-between"
        style={({ pressed }) => ({
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: pressed ? c.surfaceContainerLow : c.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: c.borderLight,
          paddingVertical: 18,
          paddingHorizontal: 20,
        })}
      >
        <View className="flex-row mt-6">
          <View className="flex-row items-center flex-1">

            <Store size={28} color={c.primary} />
            <Text
              className="ml-3 text-[16px] font-semibold"
              style={{ color: c.onSurfaceVariant }}
            >
              {t("home.viewAllCrops")}
            </Text>
          </View>
          <ChevronRight size={20} color={c.primary} />
        </View>
      </Pressable>

      {/* Update Info Bar */}
      <View
        className="flex-row items-center justify-between"
        style={{
          // marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: c.primaryLight,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 12,
        }}
      >
        <View className="flex-row items-center" style={{ flex: 1 }}>
          <Clock size={18} color={c.secondary} />
          <Text
            className="ml-2.5 flex-shrink text-[14px]"
            style={{ color: c.onSurfaceVariant }}
            numberOfLines={1}
          >
            {t("home.pricesAsOf")}
          </Text>
        </View>
        <Pressable
          onPress={onUpdate}
          className="flex-row items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text
            className="text-[14px] font-medium"
            style={{ color: c.secondary }}
          >
            {t("home.update")}
          </Text>
          <RefreshCw
            size={18}
            color={c.secondary}
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>

      {/* Source Footer */}
      <Text
        className="text-[12px]"
        style={{
          color: c.textMuted,
          marginTop: 16,
        }}
      >
        {t("home.source")}
      </Text>
    </View>
  );
}
