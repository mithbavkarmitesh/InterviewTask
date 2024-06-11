import {
  BaseText,
  BaseView,
  Button,
  Container,
  CustomTextInput,
  SubTitleText,
  TitleText,
} from "@/components/atoms";
import { useTheme } from "@/theme";
import SelectedCountry from "./SelectCountry";
import { StyleSheet } from "react-native";
import { config } from "@/theme/_config";
import GoogleSignInButtonView from "./GoogleSignInButton";
import { hp } from "@/utils/layoutUtils";
import { regExp } from "@/utils/regex";
import { useCallback } from "react";
import { CompleteIcon } from "@/theme/assets/svg";

const PhoneNumberInputContainer = ({
  inputValue,
  setInputValue,
  showCountryPicker,
  setShowCountryPicker,
  handleSelectCountry,
  isLoginScreen,
  onPrimaryButtonPress,
  selectedCountry,
  onGoogleLoginPress,
  loading,
  googleLoading,
}) => {
  const { fonts, gutters, components, layout, colors, backgrounds } =
    useTheme();

  const handleOnChangeText = useCallback(
    (text: string) => {
      // Filter out any non integer value
      const filteredText = text.replace(/[^0-9]/g, "");
      setInputValue(filteredText);
    },
    [setInputValue]
  );

  const SignInWithGoogleView = () => {
    return (
      <>
        <BaseView style={[layout.center, gutters.marginTop_32]}>
          <SubTitleText
            style={[fonts.alignCenter, fonts.green, gutters.marginTop_10]}
          >
            Or
          </SubTitleText>
        </BaseView>
        <BaseView style={gutters.marginTop_32}>
          <GoogleSignInButtonView
            onPress={onGoogleLoginPress}
            isLoading={googleLoading}
            isLoginScreen={isLoginScreen}
          />
        </BaseView>
      </>
    );
  };

  return (
    <>
      {/* Phone Number Input */}
      <BaseView>
        <TitleText style={[fonts.green, gutters.marginBottom_16]}>
          Phone Number
        </TitleText>
        <CustomTextInput
          onChangeText={handleOnChangeText}
          value={inputValue}
          placeholder="Enter Phone Number"
          placeholderTextColor={colors.placeholderColor}
          leftComponent={
            <SelectedCountry
              showCountryPicker={showCountryPicker}
              setShowCountryPicker={setShowCountryPicker}
              handleSelectCountry={handleSelectCountry}
              selectedCountry={selectedCountry}
            />
          }
          rightComponent={inputValue?.length > 9 ? <CompleteIcon /> : null}
          containerStyle={backgrounds.textInputBackground}
          inputStyle={[
            fonts.boldFont,
            backgrounds.textInputBackground,
            { color: colors.cursorColor },
          ]}
          keyboardType={"phone-pad"}
          onlyNumbers
          maxLength={10}
          blurOnSubmit
          onSubmitEditing={onPrimaryButtonPress}
        />
      </BaseView>
      {/* Request OTP Button  */}
      <BaseView>
        <Button
          variant="gradient"
          // disabled={loading}
          onPress={onPrimaryButtonPress}
          containerStyle={[components.button, { height: hp(40) }]}
          isLoading={loading}
        >
          <TitleText style={styles.otpText}>Request OTP</TitleText>
        </Button>
      </BaseView>
      {/* Sign In with Google Text */}
      <SignInWithGoogleView />
    </>
  );
};

export default PhoneNumberInputContainer;
const styles = StyleSheet.create({
  otpText: {
    textAlign: "center",
    color: config.backgrounds.white,
  },
});
