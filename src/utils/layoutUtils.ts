import { Dimensions, Platform } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

export const IS_IOS = Platform.OS === "ios";

export const IS_ANDROID = Platform.OS === "android";

export const IS_DEV_ENV = __DEV__ === true;

export const DEVICE_VERSION = Platform.Version;

export const getWindowHeight = () => Dimensions.get("window").height;

export const getWindowWidth = () => Dimensions.get("window").width;

const DESIGN_SCREEN_HEIGHT = 568;
const DESIGN_SCREEN_WIDTH = 320;

// Calculate the adaptive width given the design screen width dimension.
// To be used for style props like: width, marginHorizontal, fontSize, ...
export const wp = (designWidth: number) => {
  return widthPercentageToDP((designWidth * 100) / DESIGN_SCREEN_WIDTH);
};

// Calculate the adaptive height given the design screen height dimension.
// To be used for style props like: height, marginVertical, ...
export const hp = (designHeight: number) => {
  return heightPercentageToDP((designHeight * 100) / DESIGN_SCREEN_HEIGHT);
};

export function fontSizing(size: number) {
  return Platform.OS === "ios" ? wp(size) : wp(size) - 1;
}

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
};
