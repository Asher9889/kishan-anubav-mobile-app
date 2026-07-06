import { AudioLines, Plus, Send } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

interface ChatInputRowProps {
  onOpenMoreInputBox: () => void
  isGenerating: boolean;
  inputText: string;
  onTextChange: (text: string) => void;
  onMicPress: () => void;
  onImagePress: () => void;
  onSendPress: () => void;
}

export default function ChatInputRow({
  onOpenMoreInputBox,
  isGenerating,
  inputText,
  onTextChange,
  onMicPress,
  onImagePress,
  onSendPress,
}: ChatInputRowProps) {
  const { t } = useTranslation("common");
  const c = Colors.light;
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <View style={styles.inputRow}>
      <View
        style={[
          styles.inputContainer,
          inputFocused && styles.inputContainerFocused,
        ]}
        collapsable={false}
      >

        {/* Plus Button */}

        <TouchableOpacity
          disabled={isGenerating}
          activeOpacity={0.5}
          onPress={onOpenMoreInputBox}
        >

          <Plus size={26} color="#000" fill="rgba(255, 255, 255, 0.25)" />
        </TouchableOpacity>


        {/* <TouchableOpacity
          onPress={onMicPress}
          style={[styles.iconBtn, isGenerating && { opacity: 0.5 }]}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[c.primaryContainer, "#FFB77A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Mic size={22} color="#FFFFFF" fill="rgba(255, 255, 255, 0.25)" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onImagePress}
          style={[styles.iconBtn, isGenerating && { opacity: 0.5 }]}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[c.primaryContainer, "#14B8A6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <ImagePlus size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity> */}


        <View style={styles.textInputArea} collapsable={false}>
          <TextInput
            placeholder={
              isGenerating ? t("chat.aiIsTyping") : t("chat.askQuestion")
            }
            placeholderTextColor={c.textMuted}
            value={inputText}
            onChangeText={onTextChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={styles.textInput}
            collapsable={false}
            editable={!isGenerating}
          />
        </View>


        {/* Send Button */}
        <TouchableOpacity
          className="bg-blue-600 w-12 h-12 rounded-full flex justify-center items-center"
          onPress={onSendPress}
          activeOpacity={0.85}
          disabled={inputText.length === 0 || isGenerating}
        >


          {inputText.length > 0 ?
            <Send size={20}
              color={inputText.length > 0 && !isGenerating ? "#FFFFFF" : c.textMuted}
            />
            :
            <AudioLines color={"#FFFFFF"} />
          }
        </TouchableOpacity>

      </View>



      {/* Floating Button Group */}
    

    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "yellow",
    // gap: Spacing.sm,
  },
  iconGradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.input,
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 0,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    lineHeight: undefined,
    color: Colors.light.text,
    paddingVertical: Platform.OS === "ios" ? 0 : Spacing.sm,
  },
  textInputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
