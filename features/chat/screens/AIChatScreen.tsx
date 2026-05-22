import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Mic, Send, Sparkles, Volume2 } from "lucide-react-native";

import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";

const messages = [
  {
    id: "1",
    role: "assistant",
    content:
      "👋 Namaste Farmer! How can I help you today with your crops or farming questions?",
  },

  {
    id: "2",
    role: "user",
    content: "मेरे गेहूं में पीले पत्ते आ रहे हैं",
  },

  {
    id: "3",
    role: "assistant",
    content:
      "यह नाइट्रोजन की कमी या फंगल संक्रमण का संकेत हो सकता है। क्या आप पत्तियों की फोटो भेज सकते हैं?",
  },
];

export default function AIChatScreen() {
  const colors = Colors.light;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <BlurView
          intensity={30}
          tint="light"
          style={{
            backgroundColor: colors.glass,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
          className="px-5 py-4"
        >
          <View className="flex-row items-center justify-between">
            {/* Left */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors.surfaceSecondary,
                }}
              >
                <ArrowLeft
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <View className="ml-4">
                <Text
                  className="text-xl font-extrabold"
                  style={{
                    color: colors.text,
                  }}
                >
                  Kisna AI
                </Text>

                <Text
                  className="mt-1 text-sm"
                  style={{
                    color: colors.textSecondary,
                  }}
                >
                  Your Farming Assistant
                </Text>
              </View>
            </View>

            {/* AI Badge */}
            <View
              className="flex-row items-center rounded-full px-4 py-2"
              style={{
                backgroundColor: colors.primaryLight,
              }}
            >
              <Sparkles
                size={16}
                color={colors.primary}
              />

              <Text
                className="ml-2 font-semibold"
                style={{
                  color: colors.primary,
                }}
              >
                AI
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Chat */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 140,
          }}
          renderItem={({ item }) => {
            const isUser = item.role === "user";

            return (
              <View
                className={`mb-5 ${
                  isUser
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {!isUser && (
                  <View className="mb-2 flex-row items-center">
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          colors.accentLight,
                      }}
                    >
                      <Sparkles
                        size={18}
                        color={colors.accent}
                      />
                    </View>

                    <Text
                      className="ml-3 font-bold"
                      style={{
                        color: colors.text,
                      }}
                    >
                      Kisna AI
                    </Text>
                  </View>
                )}

                <View
                  className={`rounded-[28px] px-5 py-4 ${
                    isUser
                      ? "rounded-br-md"
                      : "rounded-bl-md"
                  }`}
                  style={{
                    maxWidth: "88%",
                    backgroundColor: isUser
                      ? colors.primary
                      : colors.card,

                    borderWidth: isUser ? 0 : 1,
                    borderColor: colors.border,

                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 10,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },

                    elevation: 2,
                  }}
                >
                  <Text
                    className="text-[15px] leading-7"
                    style={{
                      color: isUser
                        ? "#FFFFFF"
                        : colors.text,
                    }}
                  >
                    {item.content}
                  </Text>

                  {!isUser && (
                    <TouchableOpacity
                      className="mt-4 self-start rounded-full px-3 py-2"
                      style={{
                        backgroundColor:
                          colors.surfaceSecondary,
                      }}
                    >
                      <View className="flex-row items-center">
                        <Volume2
                          size={15}
                          color={colors.primary}
                        />

                        <Text
                          className="ml-2 text-xs font-semibold"
                          style={{
                            color: colors.primary,
                          }}
                        >
                          Listen
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />

        {/* Input Area */}
        <BlurView
          intensity={50}
          tint="light"
          style={{
            backgroundColor: colors.glass,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
          className="absolute bottom-0 left-0 right-0 px-5 py-4"
        >
          <View className="flex-row items-center">
            {/* Text Input */}
            <View
              className="mr-3 flex-1 flex-row items-center rounded-full px-5"
              style={{
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 56,
              }}
            >
              <TextInput
                placeholder="Ask about crops, weather, diseases..."
                placeholderTextColor={colors.textMuted}
                className="flex-1 text-base"
                style={{
                  color: colors.text,
                }}
              />

              <TouchableOpacity>
                <Mic
                  size={22}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            {/* Send Button */}
            <TouchableOpacity activeOpacity={0.9}>
              <LinearGradient
                colors={[
                  colors.primaryDark,
                  colors.primary,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 w-14 items-center justify-center rounded-full"
              >
                <Send
                  size={22}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}