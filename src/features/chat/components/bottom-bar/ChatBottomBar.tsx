import { StyleSheet, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";

import ChatAudioRecorder from "../audio-recorder/ChatAudioRecorder";
import ChatInputRow from "./ChatInputRow";

interface ChatBottomBarProps {
  composerMode: "text" | "audio";
  isGenerating: boolean;
  inputText: string;
  onTextChange: (text: string) => void;
  onSendText: () => void;
  onImageUpload: () => void;
  onAudioComplete: (audioUri: string) => void;
  onCloseAudio: () => void;
  onOpenAudio: () => void;
}

export default function ChatBottomBar({
  composerMode,
  isGenerating,
  inputText,
  onTextChange,
  onSendText,
  onImageUpload,
  onAudioComplete,
  onCloseAudio,
  onOpenAudio,
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
          isGenerating={isGenerating}
          inputText={inputText}
          onTextChange={onTextChange}
          onMicPress={onOpenAudio}
          onImagePress={onImageUpload}
          onSendPress={onSendText}
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
