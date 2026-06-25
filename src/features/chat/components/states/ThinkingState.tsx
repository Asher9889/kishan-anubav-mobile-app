import { Dot } from "@/components";
import AILogo from "@/components/ui/logo";
import { Colors } from "@/constants/theme";
import { useEffect } from "react";


import { Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";


const c = Colors.light;

export default function ThinkingState() {

    const rotation = useSharedValue(0);
    const speed = useSharedValue(3000);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 3600,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

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
        <View >
            <View style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: 8
            }}>
                {/* Animated AI Orb */}
                <Animated.View style={rotateStyle}>
                    <AILogo
                        size={30}
                        width={52}
                        height={52}
                        borderRadius={26}
                    />
                </Animated.View>

                {/* Text Content */}
                <View style={{
                    backgroundColor: c.card,
                    borderWidth: 1,
                    flex: 1,
                    borderColor: c.borderLight,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 24,
                }}>
                    <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }} >
                        <Text className="text-base font-semibold" style={{ color: c.text }}>
                            Krishi AI is thinking
                        </Text>

                        <View className="flex flex-row">
                            <Dot delay={0} />
                            <Dot delay={150} />
                            <Dot delay={300} />
                        </View>

                    </View>

                    <Text
                        className="mt-1 text-sm leading-5"
                        style={{
                            color: c.textMuted,
                        }}
                    >
                        aapka Krishi AI saathi soch raha hai...
                    </Text>
                </View>
            </View>

        </View>
    );
}