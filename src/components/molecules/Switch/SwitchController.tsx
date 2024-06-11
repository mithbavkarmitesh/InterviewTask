import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const useSwitchController = (props: any) => {
  const [isActive, setIsActive] = useState<boolean>(props?.active || false);

  useFocusEffect(
    useCallback(() => {
      setIsActive(props?.active);
    }, [props?.active])
  );

  const switchTranslateX = useSharedValue<number>(isActive ? 1 : 0);

  /**
   * @description toggles switch , ON and OFF state.
   */
  const toggleSwitch = () => {
    switchTranslateX.value = withSpring(isActive ? 0 : 1, { stiffness: 80 });
    setTimeout(() => setIsActive(!isActive), 400);
    props?.getValue(!isActive);
  };

  // Animated styles
  const switchStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      switchTranslateX.value,
      [-0.15, 1],
      [0, 22] // Adjust the values for desired animation distance
    );

    return {
      transform: [{ translateX }], // Ensure translateX is a number
      backgroundColor: "transparent",
    };
  });

  return {
    isActive,
    switchStyle,
    toggleSwitch,
  };
};
