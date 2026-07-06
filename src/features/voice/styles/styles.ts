import { StyleSheet } from "react-native";
import { BACKGROUND_COLOR } from "../constants/orbConstants";

export const screenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});