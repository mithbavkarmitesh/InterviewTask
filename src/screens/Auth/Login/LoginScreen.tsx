import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeScreen } from "@/components/template";
import {
  BaseText,
  BaseView,
  Button,
  Container,
  CustomTextInput,
  SubTitleText,
  TitleText,
} from "@/components/atoms";
import {
  RNCountryFilter,
  TabSwitchControl as LoginTabSwitcherMolecule,
} from "@/components/molecules";
import { useTheme } from "@/theme";
import useLoginController from "./LoginController";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { hp, wp } from "@/utils/layoutUtils";
import { DownIcon } from "@/theme/assets/svg";
import Images from "@/theme/assets/images";
import { staticBackgroundStyles } from "@/theme/backgrounds";
import { staticFontStyles } from "@/theme/fonts";
import { config } from "@/theme/_config";
import GoogleSignInButtonView from "./components/GoogleSignInButton";
import EmailPasswordInputContainer from "./components/Email";
import PhoneNumberInputContainer from "./components/PhoneNumberInput";
import { showSuccessToast } from "@/utils/toast";
import { SocialLogin } from "./helpers";

const LoginScreen = () => {
  const {
    emailFields,
    inputValue,
    isEmailTab,
    isLoginScreen,
    showCountryPicker,
    loading,
    selectedCountry,
    googleLoading,
    onSelectCountry,
    handleEmailFieldsInput,
    handleLogin,
    setShowCountryPicker,
    setEmailTab,
    setInputValue,
    setIsLoginScreen,
    handleLoginWithPhoneNumber,
    singInWithGoogleSuccess,
    onGoogleLoginPress,
  } = useLoginController();
  const { layout, variant, colors, fonts, components, gutters } = useTheme();

  const handleSelectCountry = (country: any) => {
    // setShowCountryPicker(false);
    // 
    // onSelectCountry(country)
    // Do something with the selected country
  };

  const switchTab = () => {
    setEmailTab(!isEmailTab);
    setInputValue(""); // Clear input when switching tabs
  };

  return (
    <SafeScreen>
      <Container>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={[layout.flex_1]}
          contentContainerStyle={[layout.flex_1, layout.justifyBetween]}
          nestedScrollEnabled
        >
          <BaseView style={layout.flex_1}>
            {/* Header */}
            <BaseView
              style={[
                layout.row,
                layout.justifyBetween,
                styles.headerContainer,
              ]}
            >
              <BaseView>
                <TitleText>
                  {isLoginScreen ? "Login account" : "Signup"}
                </TitleText>
                <SubTitleText style={{ marginTop: hp(4), fontSize: 13 }}>
                  {isLoginScreen
                    ? "Hello, Welcome back!"
                    : "Welcome to Treefe!"}
                </SubTitleText>
              </BaseView>
              {/* <BaseView style={[layout.row, layout.center]}>
                <BaseView style={styles.countryContainer}>
                  <RNCountryFilter
                    selectedCountry={selectedCountry}
                    onSelectCountry={onSelectCountry}
                    showCountryPicker={showCountryPicker}
                  />
                </BaseView>
                <DownIcon
                  style={{ marginLeft: 5 }}
                  onPress={() => {
                    setShowCountryPicker(true);
                  }}
                />
              </BaseView> */}
            </BaseView>
            {/*  */}
            <BaseView style={{ marginTop: hp(35) }}>
              {/* <LoginTabSwitcherMolecule
                isEmailTab={isEmailTab}
                onSwitchTab={switchTab}
              /> */}
            </BaseView>
            {/* {isEmailTab ? (
              <EmailPasswordInputContainer
                handleEmailFieldsInput={handleEmailFieldsInput}
                emailFields={emailFields}
                isLoginScreen={isLoginScreen}
                handleLogin={handleLogin}
                isLoading={loading}
                onRequestOtp={switchTab}
              />
            ) : ( */}
            <PhoneNumberInputContainer
              isLoginScreen={isLoginScreen}
              inputValue={emailFields.phoneNumber}
              setInputValue={(t: string) =>
                handleEmailFieldsInput("phoneNumber", t)
              }
              showCountryPicker={showCountryPicker}
              selectedCountry={selectedCountry}
              setShowCountryPicker={setShowCountryPicker}
              handleSelectCountry={onSelectCountry}
              onPrimaryButtonPress={handleLoginWithPhoneNumber}
              onGoogleLoginPress={onGoogleLoginPress}
              loading={loading}
              googleLoading={googleLoading}
            />
            {/* )} */}
          </BaseView>
          {/* Footer View */}
          <BaseView style={layout.itemsCenter}>
            <SubTitleText style={fonts.green}>
              {isLoginScreen
                ? "Don’t have an account?  "
                : "Already have an account?  "}
              <SubTitleText
                style={[staticFontStyles.underline, fonts.baseTextColor]}
                onPress={() => setIsLoginScreen(!isLoginScreen)}
              >
                {isLoginScreen ? "Sign up" : "Sign in"}
              </SubTitleText>
            </SubTitleText>
            <BaseView style={{ height: hp(20) }} />
            {/* <BaseView style={{ width: "100%" }}>
              <Button
                variant="gradient"
                onPress={undefined}
                title="Skip for now"
                containerStyle={{ width: "100%" }}
                textStyle={fonts.bold}
              />
              <BaseView style={{ height: hp(25) }} />
            </BaseView> */}
          </BaseView>
        </KeyboardAwareScrollView>
      </Container>
    </SafeScreen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  headerContainer: { marginTop: hp(27) },
  countryContainer: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 2,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingVertical: 4,
    backgroundColor: "#476F22",
    borderRadius: 5,
  },
  tab: {
    padding: 5,
    backgroundColor: "#476F22",
    marginRight: 10,
    borderRadius: 5,
    flex: 1,
  },
  activeTab: {
    backgroundColor: "#709C3C",
  },
  tabText: {
    color: "black",
    textAlign: "center",
  },
  otpText: {
    paddingVertical: 11,
    textAlign: "center",
    color: config.backgrounds.white,
  },
});
