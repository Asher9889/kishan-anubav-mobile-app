import { Dot } from "@/components";
import AILogo from "@/components/ui/logo";
import { Colors } from "@/constants/theme";
import { useEffect } from "react";
import { Text, View } from "react-native";

import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const c = Colors.light;

export default function ListeningState() {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.2);

  useEffect(() => {
    /**
     * Soft breathing pulse
     * Feels like:
     * - attentive
     * - listening
     * - alive
     */
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        }),

        withTiming(1, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        })
      ),

      -1,
      false
    );

    /**
     * Ambient aura breathing
     */
    glow.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
        }),

        withTiming(0.2, {
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
        })
      ),

      -1,
      false
    );
  }, []);

  /**
   * Logo breathing animation
   */
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  /**
   * Glow layer animation
   */
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glow.value,

      transform: [
        {
          scale: interpolate(
            glow.value,
            [0.2, 1],
            [1, 1.25]
          ),
        },
      ],
    };
  });

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          justifyContent: "flex-start",

          marginBottom: 8,
        }}
      >
        {/* AI Listening Orb */}
        <View
          style={{
            width: 64,
            height: 64,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ambient Glow */}
          <Animated.View
            style={[
              {
                position: "absolute",

                width: 62,
                height: 62,

                borderRadius: 999,

                backgroundColor:
                  "rgba(37,99,235,0.12)",
              },

              glowStyle,
            ]}
          />

          {/* Breathing Logo */}
          <Animated.View style={pulseStyle}>
            <AILogo
              size={30}
              width={52}
              height={52}
              borderRadius={26}
            />
          </Animated.View>
        </View>

        {/* Text Bubble */}
        <View
          style={{
            backgroundColor: c.card,

            borderWidth: 1,

            borderColor: c.borderLight,

            paddingHorizontal: 16,
            paddingVertical: 12,

            borderRadius: 24,

            flex: 1,
          }}
        >
          {/* Title */}
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{
                color: c.text,
              }}
            >
              Krishi AI is listening
            </Text>

            {/* Animated Dots */}
            <View className="flex flex-row">
              <Dot delay={0} />
              <Dot delay={180} />
              <Dot delay={360} />
            </View>
          </View>

          {/* Subtitle */}
          <Text
            className="mt-1 text-sm leading-5"
            style={{
              color: c.textMuted,
            }}
          >
            boliye... main sun raha hoon 🌾
          </Text>
        </View>
      </View>
    </View>
  );
}