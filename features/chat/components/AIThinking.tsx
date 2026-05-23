import { Dot } from "@/components";
import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

const c = Colors.light;

export default function ThinkingState() {
    return (
        <View className="mb-6 flex-row px-5">
            <View
                className="rounded-[22px] px-5 py-4"
                style={{
                    backgroundColor: c.card,
                    borderWidth: 1,
                    borderColor: c.borderLight,
                }}
            >
                <Text
                    className="mb-4 font-medium"
                    style={{
                        color: c.textSecondary,
                    }}
                >
                    Kisna AI is thinking...
                </Text>

                <View className="flex-row items-center">
                    <Dot delay={0} />
                    <Dot delay={150} />
                    <Dot delay={300} />
                </View>
            </View>
        </View>
    );
}