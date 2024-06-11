import {
  Image,
  ImageSourcePropType,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Images from "@/theme/assets/images";
import LinearGradient from "react-native-linear-gradient";
import { hp, wp } from "@/utils/layoutUtils";
import UserStories from "../../mocks/stories";
import { UserStory } from "../../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import RootNavigation from "@/navigators/helper";
import { ROUTES } from "@/utils/routes";

export type UserStoryProps = {
  item: ListRenderItem<UserStory>;
  index: number;
  onPress: () => void;
};

const UserStoryAvatar = ({ item, index, onPress }: UserStoryProps) => {
  const userAvatarImage: ImageSourcePropType = item?.profile
    ? { uri: item?.profile }
    : Images.images.defaultAvatarSquare;
  if (index === 0)
    return (
      <>
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
              style={[
                StyleSheet.absoluteFill,
                styles.addStoryButtonAbsoluteStyle,
              ]}
            >
              <Image source={Images.icons.addIcon} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ width: wp(8) }} />
        <TouchableOpacity onPress={onPress}>
          <LinearGradient
            colors={["#4A7123", "#6D9D3F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.0 }}
            style={styles.userAvatarWrapper}
          >
            <Image source={userAvatarImage} style={styles.userAvatarImage} />
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={["#4A7123", "#6D9D3F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.0 }}
        style={styles.userAvatarWrapper}
      >
        <Image source={userAvatarImage} style={styles.userAvatarImage} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default UserStoryAvatar;

const styles = StyleSheet.create({
  addStoryImageStyle: {
    borderRadius: 13,
    height: 54,
    width: 50,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarWrapper: {
    borderRadius: 13,
    zIndex: 2,
    overflow: "hidden",
    padding: 2,
  },
  userAvatarImage: {
    borderRadius: 13,
    resizeMode: "cover",
    height: 51,
    width: 47,
  },
  addStoryButtonAbsoluteStyle: {
    backgroundColor: "rgba(0,0,0, 0.8)",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
});
