import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { wp } from "@/utils/layoutUtils";
import { BaseView } from "../atoms";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
import { navigationRef } from "@/navigators/helper";

interface ScreenHeaderProps {
  children: React.ReactNode;
  onBackPress?: () => void;
}

const ScreenHeader = ({
  children,
  onBackPress = () => navigationRef.goBack(),
}: ScreenHeaderProps) => {
  const { colors, variant } = useTheme();

  const isDarkTheme = variant === "dark";

  return (
    <BaseView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#2C2C2C" : "white" },
      ]}
    >
      <Pressable hitSlop={20} onPress={onBackPress}>
        <Image
          source={Images.icons.backIcon}
          style={{
            width: 20,
            height: 20,
            marginRight: 5,
          }}
          tintColor={isDarkTheme ? "#E4E8D7" : undefined}
        />
      </Pressable>
      <View style={{ width: "100%", paddingHorizontal: wp(10) }}>
        {children}
      </View>
    </BaseView>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(20),
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
/* 
<CustomTextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search..."
          placeholderTextColor={isDarkTheme ? "#E4E8D7" : "#355418"}
          containerStyle={[
            {
              marginBottom: 0,
              backgroundColor: colors.cardBackground,
            },
            isDarkTheme && { borderColor: undefined },
          ]}
          leftComponent={
            <Image
              source={Images.icons.searchInactiveIcon}
              style={{ aspectRatio: 1 }}
              tintColor={isDarkTheme ? "#E4E8D7" : "#355418"}
            />
          }
        />
*/
