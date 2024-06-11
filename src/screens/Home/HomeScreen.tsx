import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeTabs from "./components/HomeTabs/HomeTabs";
import RootNavigation from "@/navigators/helper";
import { ROUTES } from "@/utils/routes";
import useDoubleBackPressExit from "@/hooks/useBackHandlerForExit";
import { SafeScreen } from "@/components/template";
import { Brand } from "@/components/molecules";

const HomeScreen = () => {
  useDoubleBackPressExit();

  const { layout } = useTheme();
  const insets = useSafeAreaInsets();
  const { colors, variant } = useTheme();
  const isDarkTheme = variant === "dark";
  const backgroundColor = {
    backgroundColor: isDarkTheme ? "#2C2C2C" : "#FFFFFF",
  },
    safeViewBackgroundColor = {
      backgroundColor: isDarkTheme ? "#1C1C1C" : "#FFFFFF",
    },
    tintColor = isDarkTheme ? undefined : "#2C2C2C";

  const hasUnreadNotification = true; 

  return (
    <SafeScreen safeViewStyle={safeViewBackgroundColor}>
      {/* Header */}
      <View style={[styles.headerContainer, backgroundColor]}>
        <Brand height={50} width={50} containerStyle={backgroundColor} />
        <View style={{ flexDirection: "row", paddingRight: 10, position: 'relative' }}>
          <Pressable
            onPress={() => RootNavigation.push(ROUTES.NOTIFICATIONS)}
            hitSlop={10}
          >
            {hasUnreadNotification && (
              <View style={styles.notificationDot} />
            )}
            <Image
              style={styles.icons}
              source={Images.icons.notification}
              tintColor={tintColor}
            />
          </Pressable>

          <Image
            style={styles.icons}
            source={Images.icons.chat}
            tintColor={tintColor}
          />
        </View>
      </View>
      {/* Tabs */}
      <View style={layout.flex_1}>
        <HomeTabs />
      </View>
    </SafeScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  icons: { marginHorizontal: 8, height: 22, width: 22 },
  notificationDot: {
    position: 'absolute',
    zIndex: 1,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});
