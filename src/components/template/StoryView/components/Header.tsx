import React from "react";
import { ProfileHeader } from "react-native-story-view";
import { HeaderProps } from "./types";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
import { ImageSourcePropType } from "react-native";

const Header = ({
  userStories,
  multiStoryRef,
  closeStoryView,
  ...props
}: HeaderProps) => {
  const { colors, variant } = useTheme();
  const isDarkTheme = variant === "dark";

  const userProfileImage: ImageSourcePropType = userStories?.profile
    ? { uri: userStories.profile }
    : Images.images.defaultAvatar;
  return (
    <ProfileHeader
      userImage={userProfileImage}
      userName={userStories?.username}
      userMessage={userStories?.title}
      onClosePress={() => {
        multiStoryRef?.current?.close?.();
        closeStoryView();
      }}
      shouldShowCancelIcon={true}
      userImageStyle={{ borderWidth: 2, borderColor: colors.green }}
      {...props}
    />
  );
};

export default Header;
