import { StyleSheet, Image } from "react-native";
import React from "react";
import { Button, TitleText } from "@/components/atoms";
import Images from "@/theme/assets/images";
import { useTheme } from "@/theme";
import { SocialLogin } from "../helpers";
import { hp } from "@/utils/layoutUtils";

const GoogleSignInButtonView = ({ onPress, isLoading, isLoginScreen }) => {
  const { components, layout, colors } = useTheme();
  return (
    <Button
      variant="gradient"
      disabled={false}
      onPress={onPress}
      isLoading={isLoading}
      containerStyle={{ ...components.button, ...layout.row, height: hp(40) }}
    >
      <Image
        style={{ width: 30, height: 30, marginHorizontal: 10 }}
        source={Images.icons.googleIcon}
      />
      <TitleText
        style={{
          paddingVertical: 12,
          textAlign: "center",
          color: colors.white,
        }}
      >
        {isLoginScreen ? "Sign in" : "Sign up"} with Google
      </TitleText>
    </Button>
  );
};

export default GoogleSignInButtonView;

const styles = StyleSheet.create({});
