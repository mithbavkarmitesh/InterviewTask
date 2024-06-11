import { Image, ListRenderItem, StyleSheet, View } from "react-native";
import React from "react";
import Images from "@/theme/assets/images";
import LinearGradient from "react-native-linear-gradient";

import { UserStory } from "../../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import RootNavigation from "@/navigators/helper";
import { ROUTES } from "@/utils/routes";

export type UserStoryProps = {
  item: ListRenderItem<UserStory>;
  index: number;
  onPress: () => void;
};

const AddUserStory = ({ item, index, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={() => RootNavigation.navigate(ROUTES.CAMERA_PAGE)}
    >
      <LinearGradient
        colors={["#4A7123", "#6D9D3F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.0 }}
        style={styles.addStoryImageStyle}
      >
        <View
          style={[StyleSheet.absoluteFill, styles.addStoryButtonAbsoluteStyle]}
        >
          <Image source={Images.icons.addIcon} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AddUserStory;

const styles = StyleSheet.create({
  addStoryImageStyle: {
    borderRadius: 13,
    height: 54,
    width: 50,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  addStoryButtonAbsoluteStyle: {
    backgroundColor: "rgba(0,0,0, 0.8)",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
});
