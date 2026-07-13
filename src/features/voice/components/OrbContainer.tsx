import { LiveKitRoom } from "@livekit/react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GenerateTokenData, VoiceState } from "../types/voice.types";
import MicDebug from "./orb/MicDebug";
import VoiceOrb from "./orb/VoiceOrb";


type props = {
    state: VoiceState;
    session: GenerateTokenData | null;
    onConnected: () => void;
}

const OrbContainer = ({ state, session, onConnected }: props) => {
    const insets = useSafeAreaInsets();

    // if (state === "hidden" && !session) {
    //     return null;
    // }

    // if (state === "loading") {
    //     return (
    //         <View className='absolute right-0 left-0 items-center bg-red-300' style={[{ bottom: insets.bottom + 56 }]}>
    //             <ActivityIndicator size="small" />
    //             <Text>I am opening</Text>
    //         </View>
    //     )
    // }
    
    return (
        <LiveKitRoom
            serverUrl={session?.livekitUrl}
            token={session?.token}
            connect={true}
            audio={true}
            onConnected={() => {
                console.log("Connected to LiveKit room");
                onConnected()
            }}
        >
             <MicDebug />
            <View className='absolute right-0 left-0 items-center' style={[{ bottom: insets.bottom + 52 }]}>
                <VoiceOrb state="listening" />
            </View>
        </LiveKitRoom>
    )
}

export default OrbContainer;
