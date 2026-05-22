import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  large?: boolean;
}

export default function FeatureCard({
  title,
  subtitle,
  icon,
  large,
}: FeatureCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} className={large ? "w-full" : "flex-1"}>
      <BlurView
        intensity={30}
        tint="light"
        className={`overflow-hidden rounded-[32px] border border-blue-100 bg-white ${
          large ? "p-5" : "p-4"
        }`}
        style={{
          shadowColor: "#1D4ED8",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
        }}
      >
        <View
          className={`items-center justify-center rounded-full ${
            large ? "h-14 w-14" : "h-12 w-12"
          }`}
          style={{ backgroundColor: "rgba(22, 163, 74, 0.12)" }}
        >
          {icon}
        </View>

        <View className={large ? "ml-0 mt-4" : "mt-4"}>
          <Text
            className={`font-bold ${large ? "text-xl" : "text-lg"}`}
            style={{ color: "#0B1F3A" }}
          >
            {title}
          </Text>

          <Text className="mt-1 text-sm leading-5" style={{ color: "#5B6B84" }}>
            {subtitle}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}