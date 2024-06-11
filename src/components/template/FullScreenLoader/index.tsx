import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

// hooks
import { useTheme } from "@/theme";
// components
import { BaseView } from "@/components/atoms";

function FullScreenLoader() {
  const { colors } = useTheme();
  return (
    <BaseView
      style={[StyleSheet.absoluteFill, styles.container]}
      testID="loader"
    >
      <ActivityIndicator focusable size="large" color={colors.green} />
    </BaseView>
  );
}

export default FullScreenLoader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    flex: 1,
    elevation: 1,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    zIndex: 1,
  },
  spinner: {
    marginBottom: 50,
  },
  black: {
    backgroundColor: "black",
  },
});
