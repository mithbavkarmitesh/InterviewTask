import { SafeAreaView, StatusBar, ViewStyle } from "react-native";

import { useTheme } from "@/theme";

import type { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  safeViewStyle?: ViewStyle;
};
function SafeScreen({ children, safeViewStyle }: Props) {
  const { layout, variant, navigationTheme, backgrounds } = useTheme();

  return (
    <SafeAreaView
      style={[
        layout.flex_1,
        { backgroundColor: navigationTheme.colors.background },
        safeViewStyle,
      ]}
    >
      <StatusBar
        barStyle={variant === "dark" ? "light-content" : "dark-content"}
      />
      {children}
    </SafeAreaView>
  );
}

export default SafeScreen;
