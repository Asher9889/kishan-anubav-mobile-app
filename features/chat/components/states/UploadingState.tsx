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

interface UploadingStateProps {
  uploadType?: "voice" | "image";
}

export default function UploadingState({ uploadType = "voice" }: UploadingStateProps) {
    /**
     * Orb floating energy
     */
    const scale = useSharedValue(1);

    /**
     * Upload progress aura
     */
    const glow = useSharedValue(0.3);

    /**
     * Subtle orbital rotation
     */
    const rotation = useSharedValue(0);

    useEffect(() => {
        /**
         * Calm upload breathing
         */
        scale.value = withRepeat(
            withSequence(
                withTiming(1.06, {
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                }),

                withTiming(1, {
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                })
            ),

            -1,
            false
        );

        /**
         * Ambient upload aura
         */
        glow.value = withRepeat(
            withSequence(
                withTiming(1, {
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                }),

                withTiming(0.3, {
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                })
            ),

            -1,
            false
        );

        /**
         * Slow upload orbit
         */
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 5000,
                easing: Easing.linear,
            }),

            -1,
            false
        );
    }, []);

    /**
     * Logo floating animation
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
     * Ambient glow animation
     */
    const glowStyle = useAnimatedStyle(() => {
        return {
            opacity: glow.value,

            transform: [
                {
                    scale: interpolate(
                        glow.value,
                        [0.3, 1],
                        [1, 1.18]
                    ),
                },
            ],
        };
    });

    /**
     * Upload orbital ring
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
                {/* Upload Orb */}
                <View
                    style={{
                        width: 64,
                        height: 64,

                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Ambient Upload Glow */}
                    <Animated.View
                        style={[
                            {
                                position: "absolute",

                                width: 62,
                                height: 62,

                                borderRadius: 999,

                                backgroundColor:
                                    "rgba(20,184,166,0.10)",
                            },

                            glowStyle,
                        ]}
                    />

                    {/* Rotating Upload Ring */}
                    <Animated.View
                        style={[
                            {
                                position: "absolute",

                                width: 58,
                                height: 58,

                                borderRadius: 999,

                                borderWidth: 2,

                                borderColor:
                                    "rgba(20,184,166,0.10)",

                                borderTopColor: "#14B8A6",

                                borderRightColor: c.primary,
                            },

                            rotateStyle,
                        ]}
                    />

                    {/* Floating Logo */}
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
                            {uploadType === 'image' ? 'Uploading your image' : 'Uploading your voice'}
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
                        {uploadType === 'image' ? 'photo Krishi AI tak bheji ja rahi hai...' : 'aapki awaaz Krishi AI tak bheji ja rahi hai...'}
                    </Text>
                </View>
            </View>
        </View>
    );
}