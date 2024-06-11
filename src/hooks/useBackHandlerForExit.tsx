import { BackHandler, Platform, ToastAndroid } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

let timeout: string | number | NodeJS.Timeout | undefined;

const useDoubleBackPressExit = (additionalTasks?: () => boolean) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const { dismissAll } = useBottomSheetModal();
  const handleBackPress = useCallback(() => {
    if (backPressCount === 0) {
      if (additionalTasks) {
        return additionalTasks();
      }

      dismissAll();

      setBackPressCount((prevCount) => prevCount + 1);
      ToastAndroid.show("Press one more time to exit", ToastAndroid.SHORT);
    } else if (backPressCount === 1) {
      BackHandler.exitApp();
    }
    timeout = setTimeout(() => {
      setBackPressCount(0);
      clearTimeout(timeout);
    }, 2000);
    return true; // Prevent default back press behavior (important for Android)
  }, [backPressCount]);

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }
  }, [handleBackPress]);

  return {}; // Return an empty object or additional data as needed
};

export default useDoubleBackPressExit;
