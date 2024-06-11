import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeScreen } from "@/components/template";
import {
  Container,
  BaseView,
  TitleText,
  SubTitleText,
  Button,
  BaseText,
} from "@/components/atoms";

import { useTheme } from "@/theme";
import { Brand } from "@/components/molecules";
import useOTPController from "./OTPController";
import { hp, wp } from "@/utils/layoutUtils";

const OTPScreen = () => {
  const { layout, fonts, gutters, colors, backgrounds, variant, borders } =
    useTheme();

  const {
    otpFields,
    errorMessage,
    inputRefs,
    params,
    loading,
    counter,
    areAllFieldsFilled,
    handleTextChange,
    submitOtp,
    sendOtpAgain,
    loadingResend,
  } = useOTPController();

  const otpInputCombinedStyles = [
    styles.inputFieldStyle,
    backgrounds.textInputBackground,
    borders.secondaryBorderColor,
    fonts.baseTextColor,
    fonts.mediumFont,
    fonts.size_16,
  ];

  const viaEmail = params?.email !== undefined;
  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedTime = `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;

  return (
    <SafeScreen>
      <Container>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={[layout.flex_1]}
          contentContainerStyle={[layout.flex_1, layout.center]}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          <BaseView style={{ marginTop: -50 }}>
            <Brand width={250} height={250} />
          </BaseView>

          <BaseView style={layout.center}>
            <TitleText>Enter Verification Code</TitleText>
            <SubTitleText
              style={[fonts.alignCenter, fonts.green, gutters.marginTop_12]}
            >
              Please enter the verification code sent to{" "}
              {viaEmail
                ? params.email
                : `+${params.countryCode ?? ""}-${params.mobileNumber}`}
            </SubTitleText>
          </BaseView>
          {/* OTP view */}
          <BaseView
            style={[
              layout.row,
              { width: "80%", justifyContent: "space-evenly" },
            ]}
          >
            {otpFields.map((value, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                style={otpInputCombinedStyles}
                selectionColor={colors.baseTextColor}
                value={value}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(txt) => handleTextChange(txt, index)}
                secureTextEntry
                onSubmitEditing={
                  index === otpFields?.length - 1 ? submitOtp : undefined
                }
              />
            ))}
          </BaseView>
          {/* Button Containers */}

          {counter > 0 ? (
            <View
              style={{
                width: "100%",
                marginTop: 25,
                height: hp(40),
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <BaseText
                style={[
                  fonts.bold,
                  fonts.boldFont,
                  fonts.size_16,
                  fonts.green,
                  fonts.alignCenter,
                ]}
              >{`Resend OTP in ${formattedTime}`}</BaseText>
            </View>
          ) : (
            <Button
              variant="normal"
              onPress={counter > 0 ? undefined : sendOtpAgain}
              title={
                counter > 0 ? `Resend OTP in ${formattedTime}` : "Send Again"
              }
              containerStyle={{
                borderColor: counter > 0 ? "transparent" : colors.green,
                borderWidth: counter > 0 ? 0 : 1,
                width: "100%",
                marginTop: 25,
                height: hp(40),
              }}
              textStyle={[
                fonts.bold,
                fonts.boldFont,
                fonts.size_16,
                fonts.green,
              ]}
              isLoading={loadingResend}
            />
          )}

          <Button
            isLoading={loading}
            disabled={!areAllFieldsFilled()}
            variant="gradient"
            onPress={submitOtp}
            title="Submit"
            style={{ width: "100%", marginTop: 20 }}
            containerStyle={{ alignSelf: "stretch", height: hp(40) }}
            textStyle={[fonts.bold, fonts.boldFont, fonts.size_16, fonts.white]}
          />
        </KeyboardAwareScrollView>
      </Container>
    </SafeScreen>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  inputFieldStyle: {
    width: wp(45),
    height: hp(40),
    borderRadius: hp(3),
    borderWidth: 1,
    marginTop: hp(35),
    textAlign: "center",
  },
});
