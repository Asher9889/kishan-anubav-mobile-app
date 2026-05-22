import { Camera, CloudSun, Mic, TrendingUp } from "lucide-react-native";

import { Image, ScrollView, StatusBar, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader";
import VoiceCTA from "../components/VoiceCTA";


export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <View className="flex-1" style={{ backgroundColor: Colors.light.background }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.light.background}
        />

        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 140,
          }}
        >
          <View className="px-5 pt-8">
            {/* Hero */}
            <View className="items-center">
              <Text
                className="text-center text-4xl font-extrabold leading-[50px]"
                style={{ color: Colors.light.primaryDark }}
              >
                Namaste, Farmer Friend
              </Text>

              <Text
                className="mt-1 pt-2 text-center text-3xl font-bold"
                style={{ color: Colors.light.accentDark }}
              >
                नमस्ते, किसान मित्र
              </Text>

              <Text
                className="mt-5 text-center text-lg leading-8"
                style={{ color: Colors.light.textSecondary }}
              >
                Your AI companion for a better harvest.
              </Text>

              <Text
                className="mt-1 text-center text-lg leading-8"
                style={{ color: Colors.light.textMuted }}
              >
                बेहतर फसल के लिए आपका AI साथी।
              </Text>
            </View>

            {/* Hero Image */}
            <View
              className="mt-10 overflow-hidden rounded-[36px] border"
              style={{
                borderColor: Colors.light.border,
                shadowColor: Colors.light.primary,
                shadowOpacity: 0.14,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 14 },
                elevation: 6,
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
                }}
                resizeMode="cover"
                className="h-[260px] w-full"
              />

              <View className="absolute inset-0 bg-blue-950/15" />
            </View>

            {/* Suggested Questions */}
            <View className="mt-10">
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.light.primaryDark }}
              >
                Suggested Questions
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-5"
              >
                {[
                  "मेरे गेहूं में पीले पत्ते क्यों आ रहे हैं?",
                  "आज सिंचाई करनी चाहिए?",
                  "धान के लिए कौन सी दवा अच्छी है?",
                ].map((item) => (
                  <View
                    key={item}
                    className="mr-4 rounded-full border px-5 py-3"
                    style={{
                      backgroundColor: Colors.light.surface,
                      borderColor: Colors.light.border,
                      shadowColor: Colors.light.primary,
                      shadowOpacity: 0.07,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 2,
                    }}
                  >
                    <Text className="text-sm" style={{ color: Colors.light.accentDark }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Features */}
            <View className="mt-10 gap-4">
              <FeatureCard
                large
                title="Identify Pests"
                subtitle="Scan crops with camera • कीटों को पहचानें"
                icon={<Camera color={Colors.light.accent} size={28} />}
              />

              <View className="flex-row gap-4">
                <FeatureCard
                  title="Weather"
                  subtitle="Irrigation Advice • मौसम अलर्ट"
                  icon={<CloudSun color={Colors.light.primary} size={24} />}
                />

                <FeatureCard
                  title="Market"
                  subtitle="Crop Prices • मंडी भाव"
                  icon={<TrendingUp color={Colors.light.accent} size={24} />}
                />
              </View>

              <FeatureCard
                large
                title="Voice Assistant"
                subtitle="Ask in your language • बोलकर पूछें"
                icon={<Mic color={Colors.light.primary} size={28} />}
              />
            </View>

            <VoiceCTA />

            <Footer />
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}