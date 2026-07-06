import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VoiceScreen from "./VoiceScreen";

export default function VoiceTalkScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: height,
          marginTop: -insets.top,
          marginBottom: -insets.bottom,
        }}
      >
        <VoiceScreen />
      </View>
    </View>
  );
}
