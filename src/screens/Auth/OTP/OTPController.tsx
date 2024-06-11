import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import BackgroundTimer from "react-native-background-timer";
import {
  requestJWTToken,
  sendEmailOtp,
  sendPhoneOtp,
  verifyOtpWithEmail,
  verifyOtpWithPhoneNumber,
} from "@/services/auth";
import type { OTPScreenNavigationProp } from "@/types/navigation";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import useTypedNavigation from "@/navigators/hooks";
import { ROUTES } from "@/utils/routes";
import { useTypedDispatch, useTypedSelector } from "@/store";
import { setUser } from "@/store/userSlice";
import RootNavigation from "@/navigators/helper";
import { saveFcmToken } from "@/services/notifications";

const useOTPController = () => {
  const dispatch = useTypedDispatch();
  const [otpFields, setOtpFields] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingResend, setResendLoading] = useState(false);
  const inputRefs = useRef<Array<React.RefObject<TextInput>>>(
    [...Array(4)].map(() => React.createRef<TextInput>())
  );
  const [counter, setCounter] = useState(120);

  const { fcmToken } = useTypedSelector((store) => store.UserReducer);

  useEffect(() => {
    startTimer();
    if (counter <= 0) {
      BackgroundTimer.stopBackgroundTimer();
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [counter]);

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setCounter((time: number) => {
        if (time < 1) {
          return time;
        } else {
          return time - 1;
        }
      });
    }, 1000);
  };

  const sendFcmToken = async (username: string) => {
    try {
      const res = await saveFcmToken({
        userName: username,
        fcmToken: fcmToken,
        deviceType: "android",
      });
    } catch (error) {}
  };

  const navigator = useTypedNavigation();
  // TODO: remove default values strings
  const params = useRoute<OTPScreenNavigationProp>()?.params;

  const { mutate: validateEmailOtp } = useMutation({
    mutationFn: verifyOtpWithEmail,
    onMutate: () => setLoading(true),
  });

  const { mutate: requestOtpOnEmail } = useMutation({
    mutationFn: sendEmailOtp,
    onMutate: () => setResendLoading(true),
    onSettled: () => setResendLoading(false),
    onSuccess: ({ message }) => showSuccessToast(message),
  });
  const { mutate: requestOtpOnPhoneNumber } = useMutation({
    mutationFn: sendPhoneOtp,
    onMutate: () => {
      setCounter(120);
      // setResendLoading(true);
    },
    onSuccess: ({ message }) => showSuccessToast(message),
    onSettled: () => {
      // setResendLoading(false);
    },
    onError: () => {
      setCounter(0);
    },
  });
  // const { mutate: validatePhoneNumberOtp } = useMutation({
  //   mutationFn: verifyOtpWithPhoneNumber,
  //   onMutate: () => setLoading(true),
  // });

  const { mutate: getAuthToken } = useMutation({
    mutationFn: requestJWTToken,
    onSuccess: async ({ message, data }) => {
      dispatch(setUser(data));
      await sendFcmToken(data?.username);
      showSuccessToast(message);
      RootNavigation.reset(ROUTES.TABS);
    },
    onSettled: () => setLoading(false),
  });

  const handleTextChange = (txt: string, index: number) => {
    const newOtpFields = [...otpFields];
    newOtpFields[index] = txt;
    setOtpFields(newOtpFields);
    if (txt.length >= 1 && index < otpFields.length - 1) {
      inputRefs.current[index + 1].current?.focus();
    } else if (txt.length < 1 && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  // Memoized function using useCallback
  const areAllFieldsFilled = useCallback(() => {
    return otpFields.every((field) => field !== "");
  }, [otpFields]);

  useEffect(() => {
    if (inputRefs.current) {
      inputRefs.current?.[0].current?.focus();
    }
  }, []);

  const submitOtp = async () => {
    const otpValid = areAllFieldsFilled();
    if (!otpValid) return;
    if (params?.email) {
      validateEmailOtp(
        { otp: otpFields?.join(""), email: params.email },
        {
          onSettled: (data, error) => {
            setLoading(false);
            if (data?.code === 200) {
              showSuccessToast(data.message);
              navigator.reset(ROUTES.TABS);
            }
            if (error) {
            }
          },
        }
      );
    }
    if (params && params.mobileNumber) {
      try {
        setLoading(true);
        const response = await verifyOtpWithPhoneNumber({
          otp: otpFields?.join(""),
          phoneNumber: params?.countryCode + params.mobileNumber,
        });

        if (response && response?.code === 200) {
          const { data, message } = response;
          showSuccessToast(message);

          if (params?.countryCode && params?.mobileNumber) {
            // IF No Username Found Go to Registeration screen
            if (data === "") {
              RootNavigation.reset(ROUTES.REGISTRATION, {
                mobileNumber: params?.mobileNumber,
                countryCode: params?.countryCode,
                user: params?.user,
              });
            } else if (data !== "") {
              getAuthToken({
                username: data,
                password: "12345", // STATIC PASSWORD
              });
            } else {
              showErrorToast("Something went wrong. Try again later.");
            }
          }
        }
      } catch (error: unknown) {
        showErrorToast(error?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const sendOtpAgain = () => {
    if (params?.email) {
      requestOtpOnEmail(params?.email);
    }
    if (params?.mobileNumber) {
      setOtpFields(["", "", "", ""]); // reset state
      requestOtpOnPhoneNumber(params?.countryCode + params?.mobileNumber);
    }
  };

  return {
    otpFields,
    errorMessage,
    inputRefs,
    params,
    loading,
    loadingResend,
    counter,
    handleTextChange,
    areAllFieldsFilled,
    submitOtp,
    sendOtpAgain,
  };
};

export default useOTPController;
