import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  ActionSheetForImage,
  EditUserProfilePicture,
  SafeScreen,
} from "@/components/template";
import { useTheme } from "@/theme";
import { Brand } from "@/components/molecules";
import { IS_IOS, getWindowWidth, hp } from "@/utils/layoutUtils";
import Images from "@/theme/assets/images";
import { DownIcon } from "@/theme/assets/svg";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import useRegistrationController from "./RegistrationController";
import { Gender, MaritalStatus } from "./types";
import { convertToDate, formatDate } from "@/utils/dateutils";
import moment from "moment";
import ActionSheet from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomInputWithPlaceholder from "@/components/atoms/CustomInputWithPlaceholder";

const RegistrationView = () => {
  const { layout, fonts, colors, variant, gutters, backgrounds } = useTheme();
  const isDark = variant === "dark";
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    actionSheetRef,
    onMediaIconPressIOS,
    formFields,
    handleInputChange,
    handleButtonStateChange,
    errors,
    handleSubmit,
    formIsValid,
    stepperValue,
    handlePincodeChange,
    pincodeEditable,
    city,
    state,
    country,
    userProfileImage,
    progress,
    captureImage,
    openImageLibrary,
  } = useRegistrationController();

  const Stepper = ({
    steps,
    currentStep = -2,
  }: {
    steps: Array<any>;
    currentStep: number;
  }) => {
    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      index <= currentStep + 1
                        ? isDark
                          ? "#E4E8D7"
                          : "#DBE6CE"
                        : "#DBE6CE",
                  },
                  index <= currentStep + 1 && styles.activeCircle,
                ]}
              />
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index <= currentStep
                        ? isDark
                          ? "#4A7123"
                          : "#4A7123"
                        : "#DBE6CE",
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const setDate = (date?: Date) => {
    if (date) {
      handleInputChange("dob", formatDate(date));
    }
    setShowDatePicker(false);
  };

  return (
    <SafeScreen>
      <Container>
        <BaseView row>
          <Brand width={80} height={80} />
          <BaseView style={{ flex: 1 }}>
            <TitleText style={{ position: "absolute", left: 35, top: 40 }}>
              Registration
            </TitleText>
          </BaseView>
        </BaseView>

        <Stepper steps={[0, 1, 2]} currentStep={stepperValue} />
        <BaseView style={{ height: 30 }} />
        <KeyboardAwareScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={[layout.flex_1]}
          contentContainerStyle={[gutters.paddingBottom_40]}
          keyboardShouldPersistTaps="handled"
        >
          <EditUserProfilePicture
            onEditProfileImage={() => {
              IS_IOS
                ? onMediaIconPressIOS("0")
                : actionSheetRef?.current?.show();
            }}
            imageSource={
              userProfileImage?.remoteUri
                ? { uri: userProfileImage?.remoteUri }
                : userProfileImage?.path
                ? { uri: userProfileImage?.path }
                : Images.images.defaultAvatarSquare
            }
            imageStyle={[
              {
                overflow: "hidden",
                resizeMode: "contain",
                width: 90,
                height: 90,
              },
            ]}
            isLoading={progress > 0 && progress < 100}
          />
          <BaseView style={{ height: 30 }} />
          <CustomInputWithPlaceholder
            onlyAlphabets
            onChangeText={(t) => handleInputChange("firstName", t)}
            value={formFields.firstName}
            placeholder="First Name*"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"default"}
            containerStyle={backgrounds.textInputBackground}
            maxLength={35}
          />
          <CustomInputWithPlaceholder
            onlyAlphabets
            onChangeText={(t) => handleInputChange("lastName", t)}
            value={formFields.lastName}
            placeholder="Last Name*"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"default"}
            containerStyle={backgrounds.textInputBackground}
            maxLength={35}
          />
          {/* Gender Field */}
          <BaseView style={{ marginBottom: hp(20) }}>
            <SubTitleText style={{ marginBottom: hp(6), color: "#709C3C" }}>
              Gender<BaseText style={{ color: "red" }}>*</BaseText>
            </SubTitleText>
            <BaseView row style={{ justifyContent: "space-between" }}>
              <Button
                variant="normal"
                onPress={() => handleButtonStateChange("gender", Gender.Male)}
                title="Male"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  backgroundColor:
                    formFields.gender === Gender.Male
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.gender === Gender.Male
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
              <Button
                variant="normal"
                onPress={() => handleButtonStateChange("gender", Gender.Female)}
                title="Female"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  marginHorizontal: 5,
                  backgroundColor:
                    formFields.gender === Gender.Female
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.gender === Gender.Female
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
              <Button
                variant="normal"
                onPress={() => handleButtonStateChange("gender", Gender.Other)}
                title="Other"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  backgroundColor:
                    formFields.gender === Gender.Other
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.gender === Gender.Other
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
            </BaseView>
          </BaseView>
          {/* Martial Status Field */}
          <BaseView style={{ marginBottom: hp(20) }}>
            <SubTitleText style={{ marginBottom: hp(6), color: "#709C3C" }}>
              Marital Status<BaseText style={{ color: "red" }}>*</BaseText>
            </SubTitleText>
            <BaseView row style={{ justifyContent: "space-between" }}>
              <Button
                variant="normal"
                onPress={() =>
                  handleButtonStateChange("maritalStatus", MaritalStatus.Single)
                }
                title="Single"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  backgroundColor:
                    formFields.maritalStatus === MaritalStatus.Single
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.maritalStatus === MaritalStatus.Single
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
              <Button
                variant="normal"
                onPress={() =>
                  handleButtonStateChange(
                    "maritalStatus",
                    MaritalStatus.Married
                  )
                }
                title="Married"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  marginHorizontal: 5,
                  backgroundColor:
                    formFields.maritalStatus === MaritalStatus.Married
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.maritalStatus === MaritalStatus.Married
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
              <Button
                variant="normal"
                onPress={() =>
                  handleButtonStateChange("maritalStatus", MaritalStatus.Other)
                }
                title="Other"
                containerStyle={{
                  borderColor: colors.green,
                  borderWidth: 1,
                  flex: 1,
                  backgroundColor:
                    formFields.maritalStatus === MaritalStatus.Other
                      ? colors.green
                      : undefined,
                }}
                textStyle={[
                  fonts.mediumFont,
                  fonts.size_16,
                  fonts.green,
                  styles.verticalPadding5,
                  {
                    color:
                      formFields.maritalStatus === MaritalStatus.Other
                        ? colors.white
                        : colors.green,
                  },
                ]}
              />
            </BaseView>
          </BaseView>
          {/* DOB */}
          <BaseView>
            <SubTitleText style={{ marginBottom: hp(6), color: "#709C3C" }}>
              DOB<BaseText style={{ color: "red" }}>*</BaseText>
            </SubTitleText>
            <CustomTextInput
              onlyAlphabets
              onViewPress={() => setShowDatePicker(true)}
              editable={false}
              onChangeText={() => {}}
              value={formFields.dob}
              rightComponent={
                <Image
                  source={Images.icons.downIcon}
                  style={{ width: 20, height: 20 }}
                />
              }
              placeholder="Select a date"
              placeholderTextColor={colors.green}
              inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
              keyboardType={"default"}
              containerStyle={backgrounds.textInputBackground}
              // hasError={errors?.dob}
              // errorText="Invalid DOB"
            />
          </BaseView>
          <CustomInputWithPlaceholder
            onlyAlphabets
            onChangeText={(t) => handleInputChange("motherName", t)}
            value={formFields.motherName}
            placeholder="Mother’s Name*"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"default"}
            containerStyle={backgrounds.textInputBackground}
            maxLength={35}

            // hasError={errors?.motherName}
            // errorText="Invalid motherName"
          />
          <CustomInputWithPlaceholder
            onlyAlphabets
            onChangeText={(t) => handleInputChange("fatherName", t)}
            value={formFields.fatherName}
            placeholder="Father’s Name*"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"default"}
            containerStyle={backgrounds.textInputBackground}
            maxLength={35}

            // hasError={errors?.fatherName}
            // errorText="Invalid fatherName"
          />
          {formFields.gender === Gender.Female &&
            formFields.maritalStatus === MaritalStatus.Married && (
              <CustomInputWithPlaceholder
                onlyAlphabets
                onChangeText={(t) => handleInputChange("maidenName", t)}
                value={formFields.maidenName}
                placeholder="Maiden’s Name*"
                placeholderTextColor={colors.green}
                leftComponent={null}
                inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
                keyboardType={"default"}
                containerStyle={backgrounds.textInputBackground}
                maxLength={35}

                // hasError={errors?.fatherName}
                // errorText="Invalid fatherName"
              />
            )}
          <CustomInputWithPlaceholder
            onlyNumbers
            onChangeText={(t) => handlePincodeChange(t)}
            value={formFields.pincode}
            placeholder="Pincode"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"phone-pad"}
            containerStyle={backgrounds.textInputBackground}
            editable={pincodeEditable}
            maxLength={35}
            // hasError={errors?.pincode}
            // errorText="Invalid pincode"
          />
          <CustomInputWithPlaceholder
            onChangeText={(t) => {}}
            value={city ? `${city}, ${state}, ${country}` : city || ""}
            placeholder="City, State, Country"
            placeholderTextColor={colors.green}
            leftComponent={null}
            inputStyle={[fonts.regularFont, fonts.size_14, { height: 40 }]}
            keyboardType={"default"}
            containerStyle={backgrounds.textInputBackground}
            editable={city ? true : false}
            // hasError={errors?.address}
            // errorText="Invalid address"
          />

          <Button
            disabled={!formIsValid}
            variant="gradient"
            onPress={handleSubmit}
            title="Submit"
            style={{ width: "100%", marginTop: 20 }}
            containerStyle={{ alignSelf: "stretch", height: hp(40) }}
            textStyle={[fonts.bold, fonts.boldFont, fonts.size_16, fonts.white]}
          />
        </KeyboardAwareScrollView>
        <DateTimePickerModal
          isVisible={showDatePicker}
          date={
            formFields?.dob
              ? moment(formFields?.dob, "DD/MM/YYYY").toDate()
              : new Date()
          }
          mode="date"
          maximumDate={moment().subtract(7, "years").toDate()}
          display={IS_IOS ? "spinner" : "calendar"}
          onConfirm={setDate}
          onCancel={() => setShowDatePicker(false)}
        />
      </Container>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          height: "30%",
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        }}
      >
        <ActionSheetForImage
          onCancel={() => actionSheetRef?.current?.hide()}
          captureImage={captureImage}
          openImageLibrary={() => {
            openImageLibrary("photo");
          }}
        />
      </ActionSheet>
    </SafeScreen>
  );
};

export default RegistrationView;

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E4E8D7",
  },
  activeCircle: {
    backgroundColor: "#4A7123", // Set your active color
  },
  activeLine: {
    backgroundColor: "#6B9B3E", // Set your active color
  },
  line: {
    flex: 1,
    height: 2,
    // width: "50%",
    backgroundColor: "#E4E8D7", // Set your line color
  },
  verticalPadding5: { paddingVertical: 5 },
});
