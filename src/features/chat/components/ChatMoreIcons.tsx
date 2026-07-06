import { Camera, FileHeadphone, Image } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type props = {
    open: boolean;
    onClose: () => void;
    isGenerating: boolean;
    onMicePress: () => void
    onImagePress: () => void
}

const InputMoreItems = ({
    open,
    onClose,
    isGenerating,
    onMicePress,
    onImagePress,
}: props) => {
    if (!open) return null;
    const insets = useSafeAreaInsets();
    console.log("insets values are", insets);
    return (


        <Animated.View
            style={{
                position: "absolute",
                zIndex: 100,
                flex: 1,
                bottom: insets.bottom + 20,
                left: insets.left + 10,
            }}
            className="bg-white w-1/2 rounded-3xl p-3 shadow-lg border border-gray-200"
        >

            <Pressable
                style={[StyleSheet.absoluteFill]}
                onPress={onClose}
            />
            <TouchableOpacity
                onPress={onMicePress}
                disabled={isGenerating}
                activeOpacity={0.5}
                className={`flex-row py-4 items-center pl-4 ${isGenerating ? "opacity-50" : ""
                    }`}
            >
                <View className="w-11 h-11 rounded-full bg-orange-100 items-center justify-center">
                    <FileHeadphone size={28} color="#F97316" />
                </View>

                <Text className="ml-3 text-lg font-medium text-gray-800">
                    Audio
                </Text>
            </TouchableOpacity>

            {/* <View className="h-px bg-gray-200 my-3" /> */}

            <TouchableOpacity
                onPress={onImagePress}
                disabled={isGenerating}
                activeOpacity={0.5}
                className={`flex-row py-4 items-center pl-4 ${isGenerating ? "opacity-50" : ""
                    }`}
            >
                <View className="w-11 h-11 rounded-full bg-emerald-100 items-center justify-center">
                    <Image size={28} color="#10B981" />
                </View>

                <Text className="ml-3 text-lg  font-medium text-gray-800">
                    Gallery
                </Text>
            </TouchableOpacity>

            {/* <View className="h-px bg-gray-200 my-3" /> */}

            <TouchableOpacity
                onPress={onImagePress}
                disabled={isGenerating}
                activeOpacity={0.5}
                className={`flex-row py-4 items-center pl-4 ${isGenerating ? "opacity-50" : ""
                    }`}
            >
                <View className="w-11 h-11 rounded-full bg-emerald-100 items-center justify-center">
                    <Camera size={28} color="#10B981" />
                </View>

                <Text className="ml-3 text-lg  font-medium text-gray-800">
                    Camera
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default InputMoreItems;