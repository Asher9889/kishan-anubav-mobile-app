import { Clock, RefreshCw } from "lucide-react-native";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

import i18n from "@/i18n";
import useBazaarBhav from "../hooks/useBazaarBhav";
import type { Commodity } from "../types/types";
const CARD_WIDTH = 280;

// function formatPrice(price: string) {
//   console.log("before Formatting price:", price);
//   // const num = Number(price);
//   const num = price;
//   // if (isNaN(num)) return `₹0`;
//   console.log("Formatted price:", `₹${num.toLocaleString("en-IN")}`);
//   return `₹${num.toLocaleString("en-IN")}`;
// }

function BazaarBhavCard({ commodity, isHindi }: { commodity: Commodity; isHindi: boolean }) {
  const c = Colors.light;


  console.log("Bazaar Bhav Card Commodity:", commodity);

  return (
    <View
      className="mr-4 w-[280px] rounded-[28px] bg-white p-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F5F3EE]">
          <Text className="text-[24px]">{commodity.commodityName.charAt(0)}</Text>
        </View>
      </View>

      <Text className="mt-5 text-[20px] font-bold" style={{ color: c.onSurface }}>
        { isHindi ? commodity.commodityNameHi || commodity.commodityName : commodity.commodityName }
      </Text>

      <Text className="text-[13px]" style={{ color: c.onSurfaceVariant }}>
        {isHindi ? commodity.varietyNameHi || commodity.varietyName : commodity.varietyName} • {isHindi ? commodity.marketNameHi || commodity.marketName : commodity.marketName}
      </Text>

      <Text className="mt-5 text-[34px] font-extrabold" style={{ color: c.onSurface }}>
        {commodity.modalPrice ? commodity.modalPrice : "—"}
      </Text>

      <Text className="mt-1 text-[13px]" style={{ color: c.onSurfaceVariant }}>
        {commodity.priceUnit}
      </Text>

      <View className="my-5 h-[1px]" style={{ backgroundColor: c.borderLight }} />

      <View className="flex-row">
        <View className="flex-1 items-center">
          <Text className="text-[12px]" style={{ color: c.onSurfaceVariant }}>Min</Text>
          <Text className="mt-0.5 text-[14px] font-semibold" style={{ color: c.onSurface }}>
            {commodity.minPrice ? commodity.minPrice : "—"}
          </Text>
        </View>
        <View className="h-8 w-[1px]" style={{ backgroundColor: c.borderLight }} />
        <View className="flex-1 items-center">
          <Text className="text-[12px]" style={{ color: c.onSurfaceVariant }}>Max</Text>
          <Text className="mt-0.5 text-[14px] font-semibold" style={{ color: c.onSurface }}>
            {commodity.maxPrice ? commodity.maxPrice : "—"}
          </Text>
        </View>
      </View>

      <View className="mt-5 rounded-2xl px-3 py-3" style={{ backgroundColor: c.surfaceContainerLow }}>
        <Text className="text-center text-[12px]" style={{ color: c.onSurfaceVariant }}>
          कल का भाव: —
        </Text>
      </View>
    </View>
  );
}

export default function BazaarBhavSection() {
  const c = Colors.light;
  const { data, isLoading, refetch } = useBazaarBhav();

  const currentLangugae = i18n.language; 
  const isHindi = currentLangugae === "hi";



  const commodities = data?.data?.commodities ?? [];
  const count = data?.data?.count ?? 0;

  console.log("Bazaar Bhav Commodities length:", commodities.length); 
  console.log("Bazaar Bhav Count:", count);

  return (
    <View>
      <View className="flex-row items-center justify-between" style={{ marginBottom: 24 }}>
        <View>
          <Text className="text-[28px] font-extrabold" style={{ color: c.onSurface }}>
            {isHindi ? "बाजार भाव" : "Bazaar Bhav"}
          </Text>
          <Text className="mt-1 text-[16px]" style={{ color: c.onSurfaceVariant }}>
            {isHindi ? "प्रमुख वस्तुओं के ताज़ा दाम" : "Fresh Prices of Major Commodities"}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="h-[200px] items-center justify-center">
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : commodities.length === 0 ? (
        <View
          className="items-center justify-center rounded-[24px] px-5 py-10"
          style={{ backgroundColor: c.surfaceContainerLow }}
        >
          <Text className="text-[16px] font-medium" style={{ color: c.onSurfaceVariant }}>
            {isHindi ? "आपके क्षेत्र के लिए कोई डेटा उपलब्ध नहीं है" : "No data available for your region"}
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={commodities}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 0 }}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          renderItem={({ item }) => <BazaarBhavCard commodity={item} isHindi={isHindi} />}
        />
      )}

      <View
        className="mt-4 flex-row items-center justify-between rounded-2xl px-3 py-3.5"
        style={{ backgroundColor: c.primaryLight }}
      >
        <View className="flex-row items-center" style={{ flex: 1 }}>
          <Clock size={18} color={c.secondary} />
          <Text
            className="ml-2.5 flex-shrink text-[14px]"
            style={{ color: c.onSurfaceVariant }}
            numberOfLines={1}
          >
            {count > 0
              ? `${count} वस्तुओं के दाम अपडेट किए गए`
              : isHindi ? "कल के अपडेट दिखाए गए हैं" : "Updates from yesterday shown"}
          </Text>
        </View>
        <Pressable
          onPress={() => refetch()}
          className="flex-row items-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-[14px] font-medium" style={{ color: c.secondary }}>
            {isHindi ? "अपडेट करें" : "Update"}
          </Text>
          <RefreshCw size={18} color={c.secondary} style={{ marginLeft: 6 }} />
        </Pressable>
      </View>

      <Text className="mt-4 text-[12px]" style={{ color: c.textMuted }}>
        स्रोत: कृषि विपणन विभाग
      </Text>
    </View>
  );
}
