import { useEffect, useState } from "react";
import { EmailFields } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendEmailOtp, sendPhoneOtp } from "@/services/auth";

import { ROUTES } from "@/utils/routes";
import useTypedNavigation from "@/navigators/hooks";
import { Alert } from "react-native";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { SocialLogin } from "./helpers";
import { Country, CountryCode } from "react-native-country-picker-modal";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RootNavigation, { navigationRef } from "@/navigators/helper";
import ky from "ky";
import { useIsFocused } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const useLoginController = () => {
  const { mutate: requestOtpOnEmail } = useMutation({
    mutationFn: sendEmailOtp,
    onMutate: () => setLoading(true),
  });
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
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigator = useTypedNavigation();

  const onSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setCountryPickerVisible(false);
  };
  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
  };

  const isFocused = useIsFocused();
  const checkSignIn = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) await GoogleSignin.signOut();
    } catch (error) {
      console.debug(" Error: " + error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      checkSignIn();
    }
  }, [isFocused]);

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

  const handleLoginWithEmail = () => {
    requestOtpOnEmail(emailFields.username, {
      onSettled: (data) => {
        setLoading(false);
        if (data && data.code === 200) {
          showSuccessToast(data.message);
          navigator.navigate(ROUTES.OTPSCREEN, {
            email: emailFields.username,
          });
        }
      },
      onError: (error) => {
        Alert.alert("Something went wrong");
      },
    });
  };

  const handleLoginWithPhoneNumber = () => {
    if (emailFields.phoneNumber.length > 9)
      // Request OTP on phone number
      requestOtpOnPhoneNumber(
        selectedCountry?.callingCode?.[0] || "91" + emailFields.phoneNumber,
        {
          onSettled: async (data, error) => {
            setLoading(false);
            if (data) {
              if (data.code === 200) {
                showSuccessToast(data?.message || "OTP sent successfully");
                navigator.navigate(ROUTES.OTPSCREEN, {
                  countryCode: selectedCountry?.callingCode?.[0] || "91",
                  mobileNumber: emailFields.phoneNumber,
                });
              }
            }
          },
          onError: (error) => {
            // Alert.alert("Something went wrong");
            showErrorToast(error?.message);
          },
        }
      );
  };
  const handleLogin = () => {
    if (isEmailTab && isLoginScreen) {
      handleLoginWithEmail();
      return;
    }
    if (!isEmailTab && isLoginScreen) {
      handleLoginWithPhoneNumber();
      return;
    }
    if (!isLoginScreen && isEmailTab) {
      if (!emailFields.password && emailFields.username) return;
      navigator.push(ROUTES.REGISTRATION, {
        password: emailFields.password,
        email: emailFields.username,
      });
    }
    if (!isLoginScreen && !isEmailTab) {
      if (!emailFields.password && emailFields.username) return;
      navigator.push(ROUTES.REGISTRATION, {
        password: emailFields.password,
        mobileNumber: emailFields.username,
      });
    }
  };

  const singInWithGoogleSuccess = async ({
    result,
    googleCredential,
    idToken,
    response,
  }: {
    result: FirebaseAuthTypes.UserCredential;
    googleCredential: FirebaseAuthTypes.AuthCredential;
    idToken: string | null;
    response: any;
  }) => {
    setGoogleLoading(false);
    console.log("Response after successful: ", JSON.stringify(result));
    const { phoneNumber, email, displayName, photoURL } = result.user;
    let userResponse = {
      dob: {},
      gender: null,
      phoneNumber: phoneNumber,
      email: email,
      name: {},
      displayPhoto: photoURL,
    };
    if (result && Object.keys(response).length > 0) {
      if (
        response?.birthdays?.[0]?.date &&
        response?.birthdays?.[0]?.date?.year &&
        response?.birthdays?.[0]?.date?.month &&
        response?.birthdays?.[0]?.date?.day
      ) {
        const { day, month, year } = response?.birthdays?.[0]?.date;
        userResponse.dob = { day, month, year };
      }
      if (response?.genders?.[0]?.formattedValue) {
        userResponse.gender = response?.genders?.[0]?.formattedValue;
      }
      if (response?.names?.[0]?.givenName && response?.names?.[0]?.familyName) {
        userResponse.name = {
          firstName: response?.names?.[0]?.givenName,
          lastName: response?.names?.[0]?.familyName,
        };
      }
    }
    if (!phoneNumber && userResponse) {
      console.log("userResponse ", JSON.stringify(userResponse));
      // TODO: Go to verify mobile number
      navigator.navigate(ROUTES.VERIFY_PHONE_NUMBER, {
        user: JSON.stringify(userResponse),
      });
    } else {
      // TODO: Check if the phone number exists how do we verify
      // requestOtpOnPhoneNumber(
      //   selectedCountry?.callingCode?.[0] || "91" + emailFields.phoneNumber,
      //   {
      //     onSettled: async (data, error) => {
      //       setLoading(false);
      //       if (data) {
      //         if (data.code === 200) {
      //           showSuccessToast(data?.message || "OTP sent successfully");
      //           navigator.navigate(ROUTES.OTPSCREEN, {
      //             countryCode: selectedCountry?.callingCode?.[0] || "91",
      //             mobileNumber: emailFields.phoneNumber,
      //           });
      //         }
      //       }
      //     },
      //     onError: (error) => {
      //
      //       // Alert.alert("Something went wrong");
      //       showErrorToast(error?.message);
      //     },
      //   }
      // );
    }
  };

  useEffect(() => {
    //reset state
    setEmailFields({ username: "", password: "", phoneNumber: "" });
  }, [isEmailTab, isLoginScreen]);

  const onGoogleLoginPress = () => {
    setGoogleLoading(true);
    SocialLogin.googleLogin(singInWithGoogleSuccess, () => {
      setGoogleLoading(false);
    });
  };

  return {
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
  };
};

export default useLoginController;
