import { useEffect, useState } from "react";
import { EmailFields } from "../Login/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendEmailOtp, sendPhoneOtp } from "@/services/auth";

import { ROUTES } from "@/utils/routes";
import useTypedNavigation from "@/navigators/hooks";
import { Alert } from "react-native";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

import { Country, CountryCode } from "react-native-country-picker-modal";

import RootNavigation, { navigationRef } from "@/navigators/helper";
import { useRoute } from "@react-navigation/native";

const usePhoneInputController = () => {
  const { mutate: requestOtpOnPhoneNumber } = useMutation({
    mutationFn: sendPhoneOtp,
    onMutate: () => setLoading(true),
  });
  const [emailFields, setEmailFields] = useState<EmailFields>({
    username: "",
    password: "",
    phoneNumber: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>();
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [showCountryPicker, setShowCountryPicker] = useState<any>(false);
  const [isEmailTab, setEmailTab] = useState(true);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useRoute<any>()?.params;

  console.log("Params from route: ", JSON.stringify(params));
  const navigator = useTypedNavigation();

  const onSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setCountryPickerVisible(false);
  };
  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
  };

  /**
   * Generic Input Handler for Email Fields
   * @param fieldName
   * @param value
   */
  const handleEmailFieldsInput = (
    fieldName: keyof EmailFields,
    value: string
  ) => {
    setEmailFields((prevFields) => ({
      ...(prevFields as EmailFields),
      [fieldName]: value,
    }));
  };

  const handleLoginWithPhoneNumber = () => {
    if (emailFields.phoneNumber.length > 1)
      // Request OTP on phone number
      setLoading(true);

    requestOtpOnPhoneNumber(
      selectedCountry?.callingCode?.[0] || "91" + emailFields.phoneNumber,
      {
        onSettled: async (data, error) => {
          setLoading(false);
          if (data) {
            if (data.code === 200) {
              showSuccessToast(data?.message || "OTP sent successfully");
              RootNavigation.navigate(ROUTES.OTPSCREEN, {
                countryCode: selectedCountry?.callingCode?.[0] || "91",
                mobileNumber: emailFields.phoneNumber,
                user: params?.user,
              });
            }
          }
        },
        onError: (error) => {
          setLoading(false);

          // Alert.alert("Something went wrong");
          showErrorToast(error?.message);
        },
      }
    );
  };

  return {
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
  };
};

export default usePhoneInputController;
