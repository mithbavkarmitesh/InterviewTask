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

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { hp, wp } from "@/utils/layoutUtils";
import { CompleteIcon, DownIcon } from "@/theme/assets/svg";
import Images from "@/theme/assets/images";
import { staticBackgroundStyles } from "@/theme/backgrounds";
import { staticFontStyles } from "@/theme/fonts";
import { config } from "@/theme/_config";

import { showSuccessToast } from "@/utils/toast";
import PhoneNumberInputContainer from "../Login/components/PhoneNumberInput";
import usePhoneInputController from "./PhoneInputController";
import SelectedCountry from "../Login/components/SelectCountry";

const PhoneInputScreen = () => {
  const {
    emailFields,
    inputValue,
    isEmailTab,
    isLoginScreen,
    showCountryPicker,
    loading,
    selectedCountry,
    onSelectCountry,
    handleEmailFieldsInput,

    setShowCountryPicker,
    setEmailTab,
    setInputValue,
    setIsLoginScreen,
    handleLoginWithPhoneNumber,
  } = usePhoneInputController();
  const { layout, variant, colors, fonts, components, gutters, backgrounds } =
    useTheme();

  const handleSelectCountry = (country: any) => {
    // setShowCountryPicker(false);
    //
    // onSelectCountry(country)
    // Do something with the selected country
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

            {/*  */}
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
                <SubTitleText style={{ marginTop: hp(4) }}>
                  {isLoginScreen
                    ? "Hello, Welcome back!"
                    : "Welcome to Treefe!"}
                </SubTitleText>
              </BaseView>
            </BaseView>
            <BaseView style={{ marginTop: hp(35) }} />

            {/* Phone Number Input */}
            <BaseView>
              <TitleText style={[fonts.green, gutters.marginBottom_16]}>
                Phone Number
              </TitleText>
              <CustomTextInput
                onChangeText={(t) => handleEmailFieldsInput("phoneNumber", t)}
                value={emailFields.phoneNumber}
                placeholder="Enter Phone Number"
                placeholderTextColor={colors.cursorColor}
                leftComponent={
                  <SelectedCountry
                    showCountryPicker={showCountryPicker}
                    setShowCountryPicker={setShowCountryPicker}
                    handleSelectCountry={onSelectCountry}
                    selectedCountry={selectedCountry}
                  />
                }
                rightComponent={
                  emailFields.phoneNumber?.length > 9 ? <CompleteIcon /> : null
                }
                containerStyle={backgrounds.textInputBackground}
                inputStyle={[
                  fonts.boldFont,
                  backgrounds.textInputBackground,
                  { color: colors.cursorColor },
                ]}
                keyboardType={"phone-pad"}
                onlyNumbers
                maxLength={11}
                blurOnSubmit
                onSubmitEditing={handleLoginWithPhoneNumber}
              />
            </BaseView>
            {/* Request OTP Button  */}
            <BaseView>
              <Button
                variant="gradient"
                // disabled={loading}
                onPress={handleLoginWithPhoneNumber}
                containerStyle={[components.button, { height: hp(40) }]}
                isLoading={loading}
              >
                <TitleText style={styles.otpText}>Request OTP</TitleText>
              </Button>
            </BaseView>
          </BaseView>
        </KeyboardAwareScrollView>
      </Container>
    </SafeScreen>
  );
};

export default PhoneInputScreen;

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
