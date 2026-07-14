import { StyleSheet, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import ChatAudioRecorder from "@/features/chat/components/audio-recorder/ChatAudioRecorder";

import ChatInputRow from "./ChatInputRow";

interface ChatBottomBarProps {
  state: boolean;
  composerMode: "text" | "audio";
  onOpenMoreInputBox: () => void
  isGenerating: boolean;
  inputText: string;
  onTextChange: (text: string) => void;
  onSendText: () => void;
  onAudioComplete: (audioUri: string) => void;
  onCloseAudio: () => void;
  onOrbPress: () => void;
}

export default function ChatBottomBar({
  state,
  composerMode,
  onOpenMoreInputBox,
  isGenerating,
  inputText,
  onTextChange,
  onSendText,
  onAudioComplete,
  onCloseAudio,
  onOrbPress,
}: ChatBottomBarProps) {
  return (
    <View style={styles.bottomBar}>
      {composerMode === "audio" ? (
        <ChatAudioRecorder
          onClose={onCloseAudio}
          onRecordingComplete={onAudioComplete}
        />
      ) : (
        <ChatInputRow
          state={state}
          onOpenMoreInputBox={onOpenMoreInputBox}
          isGenerating={isGenerating}
          inputText={inputText}
          onTextChange={onTextChange}
          onSendPress={onSendText}
          onOrbPress={onOrbPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
