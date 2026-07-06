import { Camera, FileHeadphone, Image } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type props = {
    open: boolean;
    onClose: () => void;
    isGenerating: boolean;
    onMicePress: () => void
    onImagePress: () => void
}

const ChatInputMoreItems = ({
    open,
    onClose,
    isGenerating,
    onMicePress,
    onImagePress,
}: props) => {
    const insets = useSafeAreaInsets();
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    if (!open) return null;

    // useEffect(() => {
    //     const show = Keyboard.addListener(
    //         Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
    //         e => {
    //             console.log("Keyboard opened", e.endCoordinates.height)
    //             setKeyboardHeight(e.endCoordinates.height)
    //         }
    //     );

    //     const hide = Keyboard.addListener(
    //         Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
    //         () => setKeyboardHeight(0)
    //     );

    //     return () => {
    //         show.remove();
    //         hide.remove();
    //     };
    // }, []);

    return (
        <View
            style={{
                position: "absolute",
                zIndex: 100,
                flex: 1,
                bottom: insets.bottom + keyboardHeight + 20,
                left: insets.left + 10,
            }}
            className="bg-white w-1/2 rounded-3xl p-3 shadow-lg border border-gray-200"
        >
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
        </View>
    )
}

export default ChatInputMoreItems;