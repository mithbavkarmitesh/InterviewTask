import React from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ActivityIndicator,
} from "react-native";

import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";

type Props = {
  imageSource: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  onEditProfileImage?: () => void;
  isLoading?: boolean;
};
const EditUserProfile = ({
  imageSource,
  imageStyle,
  isLoading,
  onEditProfileImage,
}: Props) => {
  const { colors, layout } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          { borderColor: colors.white, overflow: "hidden", zIndex: 2 },
          styles.profileContainer,
        ]}
      >
        {isLoading ? (
          <View
            style={[
              layout.absolute,
              layout.fullWidth,
              layout.fullHeight,
              layout.center,
              { backgroundColor: "rgba(44, 44, 44, 0.7)", zIndex: 2 },
            ]}
          >
            <ActivityIndicator size={"large"} color={colors.green} />
          </View>
        ) : null}
        <Image
          source={imageSource}
          defaultSource={Images.images.defaultAvatarSquare}
          style={[styles.profileImage, imageStyle]}
          resizeMode="cover"
        />

        <Pressable
          hitSlop={30}
          onPress={onEditProfileImage}
          style={styles.editIconContainer}
        >
          <Image
            source={Images.icons.editProfileIcon}
            style={styles.editIcon}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  profileContainer: {
    borderRadius: 12,
    borderWidth: 2,
  },
  profileImage: {
    height: 73,
    width: 73,
    // borderRadius: 12,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    zIndex: 99,
    right: 10,
  },
  editIcon: {
    resizeMode: "contain",
  },
});

export default EditUserProfile;
