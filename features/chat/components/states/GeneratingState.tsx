import { Dot } from "@/components";
import AILogo from "@/components/ui/logo";
import { Colors } from "@/constants/theme";

import { useEffect } from "react";

import { Text, View } from "react-native";

import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const c = Colors.light;

export default function GeneratingState() {
    /**
     * Active generation pulse
     */
    const scale = useSharedValue(1);

    /**
     * Stronger AI glow
     */
    const glow = useSharedValue(0.4);

    /**
     * Faster intelligence orbit
     */
    const rotation = useSharedValue(0);

    useEffect(() => {
        /**
         * Active response generation pulse
         */
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, {
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                }),

                withTiming(1, {
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                })
            ),

            -1,
            false
        );

        /**
         * Stronger thinking aura
         */
        glow.value = withRepeat(
            withSequence(
                withTiming(1, {
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                }),

                withTiming(0.4, {
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                })
            ),

            -1,
            false
        );

        /**
         * Faster AI generation orbit
         */
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1800,
                easing: Easing.linear,
            }),

            -1,
            false
        );
    }, []);

    /**
     * Floating generation energy
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
     * Dynamic AI glow
     */
    const glowStyle = useAnimatedStyle(() => {
        return {
            opacity: glow.value,

            transform: [
                {
                    scale: interpolate(
                        glow.value,
                        [0.4, 1],
                        [1, 1.25]
                    ),
                },
            ],
        };
    });

    /**
     * High-energy orbital motion
     */
    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${rotation.value}deg`,
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

                    marginBottom: 16,
                }}
            >
                {/* AI Generation Orb */}
                <View
                    style={{
                        width: 64,
                        height: 64,

                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Ambient Generation Glow */}
                    <Animated.View
                        style={[
                            {
                                position: "absolute",

                                width: 64,
                                height: 64,

                                borderRadius: 999,

                                backgroundColor:
                                    "rgba(37,99,235,0.14)",
                            },

                            glowStyle,
                        ]}
                    />

                    {/* High-Energy Orbit */}
                    <Animated.View
                        style={[
                            {
                                position: "absolute",

                                width: 60,
                                height: 60,

                                borderRadius: 999,

                                borderWidth: 2,

                                borderColor:
                                    "rgba(37,99,235,0.08)",

                                borderTopColor: c.primary,

                                borderRightColor: "#14B8A6",

                                shadowColor: c.primary,

                                shadowOpacity: 0.16,

                                shadowRadius: 12,

                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },

                                elevation: 6,
                            },

                            rotateStyle,
                        ]}
                    />

                    {/* Active AI Core */}
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
                    {/* Header */}
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
                            Kisna AI is generating response
                        </Text>

                        {/* Animated Dots */}
                        <View className="flex flex-row">
                            <Dot delay={0} />
                            <Dot delay={120} />
                            <Dot delay={240} />
                        </View>
                    </View>

                    {/* Subtitle */}
                    <Text
                        className="mt-1 text-sm leading-5"
                        style={{
                            color: c.textMuted,
                        }}
                    >
                        aapke sawaal ka best jawaab taiyaar kiya ja raha hai...
                    </Text>
                </View>
            </View>
        </View>
    );
}