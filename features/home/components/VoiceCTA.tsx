import { router } from "expo-router";
import { Mic } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function VoiceCTA() {
  return (
    <View className="flex-1 mt-10 items-center justify-center">
      <TouchableOpacity
        activeOpacity={0.9}
        className="w-full overflow-hidden rounded-full"
      >

        <View className="flex-1 flex-row w-full h-16 items-center justify-center rounded-full bg-green-600">
          <Mic size={24} color="#FFFFFF" />

          <Text onPress={() => router.push("/chat")} className="ml-3 text-2xl font-extrabold text-white shadow-xl shadow-black">
            Start Asking AI
          </Text>
        </View>


      </TouchableOpacity>

      <Text className="mt-2 text-center text-sm text-slate-500">
        Supports Hindi, Punjabi, Marathi & English
      </Text>
    </View>
  );
}