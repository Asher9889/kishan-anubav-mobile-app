import {
    Colors,
    Radius,
    Spacing,
    Typography,
} from "@/constants/theme";
import { Platform, StyleSheet } from "react-native";

export const BTN_SIZE = 38;
export const MENU_BTN_SIZE = 46;

export const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  inputContainer: {
    minHeight: 56,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.input,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },

  inputFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: "#FFFFFF",

    shadowColor: Colors.light.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 2,
  },

  textInput: {
    flex: 1,

    ...Typography.body,

    color: Colors.light.text,

    paddingHorizontal: Spacing.sm,

    paddingVertical:
      Platform.OS === "ios" ? 8 : 4,
  },

  leftButtonWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  floatingMenu: {
    position: "absolute",

    bottom: 52,

    left: -4,

    alignItems: "center",

    gap: 10,
  },

  rightButton: {
    marginLeft: 4,
  },
});