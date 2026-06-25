import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Footer() {
  return (
    <View className="items-center justify-center py-10 mt-10">
      <View className="flex-row items-center">
        <Text className="text-sm text-slate-500">
          Built with
        </Text>

        <Heart
          size={14}
          color="#EF4444"
          fill="#EF4444"
          style={{ marginHorizontal: 6 }}
        />

        <Text className="text-sm text-slate-500">
          for Indian Farmers 🇮🇳
        </Text>
      </View>

      <Text className="mt-2 text-xs text-slate-400">
        Powered by AI & खेती का अनुभव
      </Text>
    </View>
  );
}