import React from "react";
import {
  Image,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";

import MarketStat from "./MarketStat";
import MarketTrendBadge from "./MarketTrendBadge";

interface Props {
  cropName: string;

  englishName: string;

  image: string;

  modalPrice: number;

  previousPrice: number;

  minPrice: number;

  maxPrice: number;

  trend: "up" | "down";
}

export default function MarketPriceCard({
  cropName,
  englishName,
  image,
  modalPrice,
  previousPrice,
  minPrice,
  maxPrice,
  trend,
}: Props) {
  const c = Colors.light;

  const difference =
    modalPrice - previousPrice;

  const percentage = ((difference / previousPrice) * 100).toFixed(1);

  return (
    <View
      className="mr-4 w-[280px] rounded-[28px] bg-white p-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        elevation: 5,
      }}
    >
      {/* Top */}

      <View className="flex-row items-center justify-between">

        <Image
          source={{
            uri: image,
          }}
          resizeMode="contain"
          className="h-16 w-16"
        />

        <MarketTrendBadge
          trend={trend}
          change={`${difference > 0 ? "+" : ""}₹${Math.abs(
            difference
          )}`}
        />

      </View>

      {/* Crop */}

      <Text
        className="mt-5 text-[20px] font-bold"
        style={{
          color: c.onSurface,
        }}
      >
        {cropName}
      </Text>

      <Text
        className="text-[13px]"
        style={{
          color: c.onSurfaceVariant,
        }}
      >
        {englishName}
      </Text>

      {/* Price */}

      <Text
        className="mt-5 text-[34px] font-extrabold"
        style={{
          color: c.onSurface,
        }}
      >
        ₹{modalPrice.toLocaleString()}
      </Text>

      <Text
        className="mt-1 text-[13px]"
        style={{
          color: c.onSurfaceVariant,
        }}
      >
        प्रति क्विंटल
      </Text>

      {/* Change */}

      <Text
        className="mt-3 text-[14px] font-semibold"
        style={{
          color:
            trend === "up"
              ? c.secondary
              : c.error,
        }}
      >
        {difference > 0 ? "+" : ""}
        ₹{Math.abs(difference)}
        {"  "}
        ({percentage}%)
      </Text>

      {/* Divider */}

      <View
        className="my-5 h-[1px]"
        style={{
          backgroundColor:
            c.borderLight,
        }}
      />

      {/* Stats */}

      <View className="flex-row">

        <MarketStat
          label="Min"
          value={`₹${minPrice}`}
        />

        <MarketStat
          label="Max"
          value={`₹${maxPrice}`}
        />

      </View>

      {/* Yesterday */}

      <View
        className="mt-5 rounded-2xl px-3 py-3"
        style={{
          backgroundColor:
            c.surfaceContainerLow,
        }}
      >
        <Text
          className="text-center text-[12px]"
          style={{
            color:
              c.onSurfaceVariant,
          }}
        >
          Yesterday ₹
          {previousPrice.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}