import React from "react";
// import { Colors } from "@/theme/Variables";
import Animated from "react-native-reanimated";

import { View, StyleSheet, Pressable, Image } from "react-native";
import { useSwitchController } from "./SwitchController";
import { hp, wp } from "@/utils/layoutUtils";
import Images from "@/theme/assets/images";

const CustomSwitch = (props: any) => {
  const { isActive, switchStyle, toggleSwitch } = useSwitchController(props);

  return (
    <Pressable onPress={toggleSwitch}>
      <View
        style={[
          styles.switchContainer,
          isActive ? styles.activeContainer : styles.inActiveContainer,
        ]}
      >
        <Animated.View style={[styles.switchThumb, switchStyle]}>
          <Image
            source={
              isActive ? Images.icons.darkModeIcon : Images.icons.lightModeIcon
            }
            style={{ height: 18, width: 18, borderRadius: 9 }}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: wp(40),
    height: hp(20),
    borderRadius: wp(10),
    justifyContent: "center",
    borderColor: "#709C3C",
    borderWidth: 2,
  },
  activeContainer: {
    backgroundColor: "#2C2C2C",
  },
  inActiveContainer: {
    backgroundColor: "#DBE6CE",
  },
  switchThumb: {
    // width: wp(16),
    // height: hp(16),
    // borderRadius: wp(8),
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "transparent",
  },
});

export default CustomSwitch;
