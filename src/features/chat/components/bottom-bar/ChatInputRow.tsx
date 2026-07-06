import {
  Mic,
  Plus,
  Send,
} from "lucide-react-native";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from "react-native";

import {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

import ChatActionButton from "./ChatActionButton";
import ChatInputMenu from "./ChatInputMenu";
import ChatTextInput from "./ChatTextInput";
import { styles } from "./styles";

interface Props {
  isGenerating: boolean;
  inputText: string;

  onTextChange: (text: string) => void;

  onMicPress: () => void;
  onImagePress: () => void;
  onSendPress: () => void;
}

export default function ChatInputRow({
  isGenerating,
  inputText,
  onTextChange,
  onMicPress,
  onImagePress,
  onSendPress,
}: Props) {
  const c = Colors.light;

  const [focused, setFocused] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const toggleMenu = () => {
    setExpanded(prev => !prev);
  };

  const plusAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(
            expanded ? "45deg" : "0deg"
          ),
        },
      ],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>



        <View style={styles.container}>
          {/* Floating Menu */}
          {expanded && (
            <ChatInputMenu
              expanded={{ value: expanded } as any}
              onImagePress={() => {
                setExpanded(false);
                onImagePress();
              }}
              onMicPress={() => {
                setExpanded(false);
                onMicPress();
              }}
            />
          )}

          <View
            style={[
              styles.inputContainer,
              focused && styles.inputFocused,
            ]}
          >
            {/* Left Button */}
            <View style={styles.leftButtonWrapper}>
              <ChatActionButton
                onPress={toggleMenu}
                colors={[
                  c.primaryContainer,
                  "#FFB77A",
                ]}
                animatedStyle={plusAnimatedStyle}
              >
                <Plus
                  size={20}
                  color="#FFFFFF"
                />
              </ChatActionButton>
            </View>

            {/* Text Input */}

            <ChatTextInput
              value={inputText}
              isGenerating={isGenerating}
              onChangeText={onTextChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {/* Right Button */}

            {inputText.trim().length > 0 ? (
              <View style={styles.rightButton}>
                <ChatActionButton
                  onPress={onSendPress}
                  disabled={isGenerating}
                  colors={[
                    c.primaryDark,
                    c.primary,
                  ]}
                >
                  <Send
                    size={18}
                    color="#FFFFFF"
                  />
                </ChatActionButton>
              </View>
            ) : (
              <View style={styles.rightButton}>
                <ChatActionButton
                  onPress={onMicPress}
                  disabled={isGenerating}
                  colors={[
                    c.primaryContainer,
                    "#FFB77A",
                  ]}
                >
                  <Mic
                    size={20}
                    color="#FFFFFF"
                  />
                </ChatActionButton>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}