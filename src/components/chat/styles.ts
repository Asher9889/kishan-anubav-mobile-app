import { StyleSheet } from "react-native";

import {
    Colors,
    Radius,
    Spacing,
    Typography,
} from "@/constants/theme";

export const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginBottom: Spacing.lg + 4,
  },

  userRow: {
    alignItems: "flex-end",
  },

  aiRow: {
    alignItems: "flex-start",
  },

  /*
   * AI Header
   */

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: Spacing.sm,
  },

  aiTitleContainer: {
    marginLeft: Spacing.sm,
  },

  aiName: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.light.text,
  },

  aiStatus: {
    ...Typography.caption,
    color: Colors.light.textMuted,
    marginTop: 2,
  },

  /*
   * AI Content
   */

  aiContent: {
    width: "95%",
    paddingLeft: 44,
  },

  /*
   * User Bubble
   */

  userBubble: {
    maxWidth: "78%",

    backgroundColor: Colors.light.primary,

    borderRadius: Radius.xxl,

    borderBottomRightRadius: Radius.sm,

    paddingHorizontal: Spacing.md + 2,

    paddingVertical: Spacing.md,
  },

  /*
   * Footer
   */

  footer: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: Spacing.sm,

    gap: Spacing.md,
  },

  /*
   * Timestamp
   */

  timestamp: {
    ...Typography.small,
    color: Colors.light.textMuted,
  },

  /*
   * User Timestamp
   */

  userFooter: {
    marginTop: 6,
    marginRight: 4,
    alignSelf: "flex-end",
  },

  /*
   * AI Footer
   */

  aiFooter: {
    marginTop: Spacing.sm,
    marginLeft: 44,
  },
});