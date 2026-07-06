import {
  ChevronDown,
  Clock,
  MapPin,
  RefreshCw,
  Store
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import i18n from "@/i18n";
import type { ILocationData } from "@/shared/types/types";

import useMarketPrices from "../hooks/useMarketPrices";
import type { Commodity } from "../types/types";

interface Props {
  location?: ILocationData;
  localizedLocation?: ILocationData;
  onSeeAll?: () => void;
}

const CARD_WIDTH = 300;

function formatPrice(price: string) {
  const num = Number(price);
  if (isNaN(num)) return `₹0`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function MarketPriceCard({ commodity }: { commodity: Commodity }) {
  const { t } = useTranslation("common");
  const c = Colors.light;
  const isHindi = i18n.language === "hi";

  const name = isHindi
    ? commodity.commodityNameHi || commodity.commodityName
    : commodity.commodityName;

  const market = isHindi
    ? commodity.marketNameHi || commodity.marketName
    : commodity.marketName;

  const grade = isHindi
    ? commodity.gradeNameHi || commodity.gradeName
    : commodity.gradeName;

  const variety = isHindi
    ? commodity.varietyNameHi || commodity.varietyName
    : commodity.varietyName;

  const priceUnit = isHindi
    ? "प्रति क्विंटल"
    : commodity.priceUnit;

  return (
    <View
      style={{
        width: CARD_WIDTH,
        backgroundColor: c.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.borderLight,
        padding: 16,
      }}
    >
      {/* Top Row: Avatar + Name + Grade */}
      <View className="flex-row items-start">
        <View
          className="items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: c.surfaceContainerLow,
          }}
        >
          <Text
            className="text-[24px] font-extrabold"
            style={{ color: c.primary, letterSpacing: -0.5 }}
          >
            {commodity.commodityName.charAt(0)}
          </Text>
        </View>

        <View className="ml-3 flex-1 justify-center" style={{ minHeight: 64 }}>
          <Text
            className="text-[25px] pt-2 font-bold leading-tight"
            style={{ color: c.onSurface }}
            numberOfLines={2}
          >
            {name}
          </Text>
          <View className="mt-1.5 flex-row items-center" style={{ gap: 8 }}>
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: c.primaryMuted as string }}
            >
              <Text
                className="text-[11px] font-semibold"
                style={{ color: c.primary }}
              >
                {grade}
              </Text>
            </View>
            <Text
              className="text-[12px] font-medium"
              style={{ color: c.onSurfaceVariant }}
              numberOfLines={1}
            >
              {variety}
            </Text>
          </View>
        </View>
      </View>

      {/* Market Name */}
      <View
        className="mt-3 flex-row items-center rounded-xl px-3 py-2.5"
        style={{ backgroundColor: c.surfaceContainerLow }}
      >
        <Store size={14} color={c.primary} />
        <Text
          className="ml-2 flex-1 text-[13px] font-medium"
          style={{ color: c.onSurface }}
          numberOfLines={1}
        >
          {market}
        </Text>
      </View>

      {/* Price */}
      <View className="mt-4 flex-row items-baseline">
        <Text
          className="text-[42px] font-extrabold"
          style={{ color: c.onSurface, letterSpacing: -1 }}
        >
          {commodity.modalPrice}
        </Text>
        <Text
          className="ml-2 text-[13px] font-medium"
          style={{ color: c.onSurfaceVariant }}
        >
          {priceUnit}
        </Text>
      </View>

      {/* Divider */}
      <View
        className="my-4 h-px"
        style={{ backgroundColor: c.borderLight }}
      />

      {/* Metadata Row: Min | Max | Yesterday */}
      <View className="flex-row items-stretch">
        <View className="flex-1 items-center py-1">
          <Text
            className="text-[11px] font-semibold tracking-wide"
            style={{ color: c.onSurfaceVariant }}
          >
            {t("home.minPrice")}
          </Text>
          <Text
            className="mt-1 text-[15px] font-bold"
            style={{ color: c.onSurface }}
          >
            {commodity.minPrice}
          </Text>
        </View>
        <View
          style={{ width: 1, backgroundColor: c.borderLight }}
        />
        <View className="flex-1 items-center py-1">
          <Text
            className="text-[11px] font-semibold tracking-wide"
            style={{ color: c.onSurfaceVariant }}
          >
            {t("home.maxPrice")}
          </Text>
          <Text
            className="mt-1 text-[15px] font-bold"
            style={{ color: c.onSurface }}
          >
            {commodity.maxPrice}
          </Text>
        </View>
        <View
          style={{ width: 1, backgroundColor: c.borderLight }}
        />
        <View className="flex-1 items-center py-1">
          <Text
            className="text-[11px] font-semibold tracking-wide"
            style={{ color: c.onSurfaceVariant }}
          >
            {t("home.yesterdaysPrice")}
          </Text>
          <Text
            className="mt-1 text-[15px] font-bold"
            style={{ color: c.onSurfaceVariant }}
          >
            —
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function HomePageMarketPriceSection({
  location,
  localizedLocation,
  onSeeAll,
}: Props) {
  const { t } = useTranslation("common");
  const c = Colors.light;

  const cityName = location?.city ?? "";
  const districtName = location?.district ?? "";
  const { data, isLoading, isFetching, refetch } = useMarketPrices(cityName, districtName);

  const commodities = data?.data?.commodities ?? [];
  const count = data?.data?.count ?? 0;
  const displayLocation = localizedLocation || location;
  const isHindi = i18n.language === "hi";

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
              {displayLocation
                ? `${displayLocation.city}, ${displayLocation.region}`
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

      {/* Commodities Carousel */}
      {isLoading ? (
        <View className="h-[280px] items-center justify-center">
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : commodities.length === 0 ? (
        <View
          className="items-center justify-center rounded-[24px] px-5 py-10"
          style={{ backgroundColor: c.surfaceContainerLow }}
        >
          <Text
            className="text-[16px] font-medium"
            style={{ color: c.onSurfaceVariant }}
          >
            {isHindi
              ? "आपके क्षेत्र के लिए कोई डेटा उपलब्ध नहीं है"
              : "No data available for your region"}
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={commodities}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          renderItem={({ item }) => <MarketPriceCard commodity={item} />}
        />
      )}

      {/* View All Button opencode do not remove Pressable button i will use it later  */}
      
      {/* <Pressable
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
      </Pressable> */}

      {/* Update Info Bar */}
      <View
        className="flex-row items-center justify-between"
        style={{
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
            {count > 0
              ? isHindi
                ? `${count} वस्तुओं के दाम अपडेट किए गए`
                : `${count} commodities updated`
              : isHindi
                ? "कल के अपडेट दिखाए गए हैं"
                : "Updates from yesterday shown"}
          </Text>
        </View>
        <Pressable
          onPress={() => refetch()}
          className="flex-row items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
        >
          {isFetching ? (
            <ActivityIndicator size="small" color={c.secondary} />
          ) : (
            <>
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
            </>
          )}
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
