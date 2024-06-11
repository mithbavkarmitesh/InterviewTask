import React, { useEffect, useState } from "react";
import { Alert, Keyboard, StyleSheet } from "react-native";
import { Footer as StoryFooter } from "react-native-story-view";
import { FooterProps } from "./types";
import { useTheme } from "@/theme";
import { IS_IOS } from "@/utils/layoutUtils";

const Footer = ({
  userStories,
  story,
  progressIndex,
  storyHeartOrUnheart,
}: FooterProps) => {
  const { colors, variant, backgrounds } = useTheme();
  const isDarkTheme = variant === "dark";
  const containerStyle = StyleSheet.flatten([
    backgrounds.primaryBackground,
    { marginBottom: IS_IOS ? -10 : 0 },
  ]);

  const [filledHeart, setFilledHeart] = useState(false);

  useEffect(() => {
    setFilledHeart(story?.[progressIndex!].isHearted);
  }, [story?.[progressIndex!].isHearted]);

  useEffect(() => {
    // console.log("filledHeart", filledHeart)
  }, [filledHeart]);

  return (
    <StoryFooter
      onSendTextPress={() => {
        Alert.alert(
          `${"Message sent to"} ${userStories?.username} id ${
            story?.[progressIndex!].id
          }`
        );
        Keyboard.dismiss();
      }}
      inputStyle={{ color: isDarkTheme ? "#E4E8D7" : "#2C2C2C" }}
      sectionViewStyle={{ borderColor: isDarkTheme ? "#E4E8D7" : "#709C3C" }}
      heartIconProps={{ tintColor: isDarkTheme ? "#E4E8D7" : "#709C3C" }}
      sendIconProps={{
        tintColor: isDarkTheme ? "#E4E8D7" : "#709C3C",
      }}
      onHeartIconPress={() => {
        storyHeartOrUnheart(story?.[progressIndex!].id, (flag: boolean) => {
          setFilledHeart(flag);
        });
      }}
      filledHeartIcon={filledHeart}
      sendTextStyle={{ color: isDarkTheme ? "#E4E8D7" : "#2C2C2C" }}
      containerStyle={containerStyle}
      placeholderTextColor={isDarkTheme ? "#E4E8D7" : "#2C2C2C"}
    />
  );
};

export default Footer;
