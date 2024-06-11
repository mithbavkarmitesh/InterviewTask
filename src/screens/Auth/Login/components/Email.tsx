import React from "react";
import { StyleSheet } from "react-native";

import {
  BaseView,
  Button,
  CustomTextInput,
  SubTitleText,
  TitleText,
} from "@/components/atoms";
import { useTheme } from "@/theme";
import { config } from "@/theme/_config";
import GoogleSignInButtonView from "./GoogleSignInButton";

const styles = StyleSheet.create({
  otpText: {
    paddingVertical: 11,
    textAlign: "center",
    color: config.backgrounds.white,
  },
});

const EmailPasswordInputContainer = ({
  handleEmailFieldsInput,
  emailFields,
  isLoginScreen,
  handleLogin,
  isLoading,
  onRequestOtp,
}) => {
  const { fonts, colors, gutters, components, layout, backgrounds } =
    useTheme();
  return (
    <>
      <GoogleSignInButtonView />
      <TitleText style={[fonts.alignCenter, gutters.marginTop_12]}>
        or continue with
      </TitleText>
      <BaseView style={{ marginVertical: 6 }} />
      {/* Email Field */}
      <CustomTextInput
        onChangeText={(t) => {
          handleEmailFieldsInput("username", t);
        }}
        value={emailFields.username}
        placeholder="Enter Email ID"
        placeholderTextColor={colors.green}
        inputStyle={[fonts.mediumFont, gutters.paddingVertical_10]}
        keyboardType={"email-address"}
        autoCapitalize="none"
      />
      {/* Password field */}
      {/* {!isLoginScreen && ( */}
      <CustomTextInput
        onChangeText={(t) => {
          handleEmailFieldsInput("password", t);
        }}
        value={emailFields.password}
        placeholder="Enter Password"
        placeholderTextColor={colors.green}
        inputStyle={[
          fonts.mediumFont,
          gutters.paddingVertical_10,
          { color: colors.white },
        ]}
        secureTextEntry
        rightComponent={null}
        containerStyle={{ marginTop: -10 }}
        keyboardType={"default"}
      />
      {/* )} */}

      <Button
        variant="gradient"
        disabled={isLoading}
        onPress={handleLogin}
        containerStyle={components.button}
        isLoading={isLoading}
      >
        <TitleText style={styles.otpText}>Log in</TitleText>
      </Button>
      <BaseView style={[layout.center, gutters.marginTop_16]}>
        <SubTitleText style={[fonts.alignCenter, fonts.green]}>
          Or{"\n"}
          {isLoginScreen ? "Sign in" : "Sign up"} with Mobile
        </SubTitleText>
      </BaseView>
      <BaseView style={gutters.marginTop_12}>
        <Button
          variant="gradient"
          disabled={false}
          onPress={onRequestOtp}
          containerStyle={components.button}
        >
          <TitleText style={styles.otpText}>Request OTP</TitleText>
        </Button>
      </BaseView>
    </>
  );
};
export default EmailPasswordInputContainer;
