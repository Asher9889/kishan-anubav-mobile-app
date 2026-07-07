import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VoiceState } from "../types/voice.types";
import Orb from "./Orb";

type props = {
    state: VoiceState;
}

const OrbContainer = ({ state }: props) => {

    const insets = useSafeAreaInsets();

    if (state === "hidden") {
        return (<View className='absolute right-0 left-0 items-center bg-red-300' style={[{ bottom: insets.bottom }]}>
            <ActivityIndicator />
        </View>
        )
    }

    return (
        <View className='absolute right-0 left-0 items-center' style={[{ bottom: insets.bottom + 10 }]}>
            <Orb state='listening' />
        </View>
    )
}

export default OrbContainer;
