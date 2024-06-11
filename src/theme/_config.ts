import { DarkTheme } from "@react-navigation/native";

import type { ThemeConfiguration } from "@/types/theme/config";

const colorsLight = {
  red500: "#C13333",
  gray800: "#303030",
  gray400: "#4D4D4D",
  gray200: "#A1A1A1",
  gray150: "#515151",
  gray100: "#DFDFDF",
  gray50: "#EFEFEF",
  purple500: "#44427D",
  purple100: "#E1E1EF",
  baseTextColor: "#476F22",
  primaryBackground: "#F7F8F3",
  paginationDotColor: "rgba(112,156,60,0.4)",
  gradient1: "#486F21",
  gradient2: "#6D9D3F",
  white: "#FFFFFF",
  gray: "#7B7B7B",
  green: "#709C3C",
  secondaryBackground: "#E4E8D7",
  secondaryBorderColor: "#709C3C",
  cursorColor: "#1C1C1C",
  topicBackground: "#FFFFFF",
  topicTextColor: "#2C2C2C",
  tabBackground: "#FFFFFF",
  cardBackground: "#ADC178",
  topTab: "#DBE6CE",
  onboardingBackground: "#FFFFFF",
  placeholderColor: "#709C3C",
  textInputBackground: "#FFFFFF",
  gray300: "#6D6D6D",
  messageRed: "#FD5454",
  postText: "#1C1C1C",
  buttonVariant2: "#476F22",
} as const;

const colorsDark = {
  gray800: "#E0E0E0",
  gray400: "#969696",
  gray300: "#B1B1B1",
  gray200: "#BABABA",
  gray150: "#515151",
  gray100: "#000000",
  purple500: "#A6A4F0",
  purple100: "#252732",
  purple50: "#1B1A23",
  baseTextColor: "#E4E8D7",
  primaryBackground: "#2C2C2C",
  paginationDotColor: "#E4E8D7",
  gradient1: "#486F21",
  gradient2: "#6D9D3F",
  white: "#FFFFFF",
  gray: "#CCCCCC",
  green: "#709C3C",
  secondaryBackground: "#515151",
  secondaryBorderColor: "#515151",
  cursorColor: "#FFFFFF",
  topicBackground: "#1C1C1C",
  topicTextColor: "#E4E8D7",
  tabBackground: "#1C1C1C",
  cardBackground: "#515151",
  topTab: "#515151",
  onboardingBackground: "#2C2C2C",
  placeholderColor: "#FFFFFF",
  textInputBackground: "#2C2C2C",
  messageRed: "#FD5454",
  postText: "#E4E8D7",
  buttonVariant2: "#E4E8D7",
} as const;

const sizes = [8, 10, 12, 14, 16, 18, 24, 32, 40, 80] as const;

export const config = {
  fonts: {
    sizes,
    colors: colorsLight,
  },
  gutters: sizes,
  backgrounds: colorsLight,
  borders: {
    widths: [1, 2],
    radius: [4, 16],
    colors: colorsLight,
  },
  navigationColors: {
    ...DarkTheme.colors,
    background: colorsLight.primaryBackground,
    card: colorsLight.primaryBackground,
  },
  variants: {
    dark: {
      fonts: {
        colors: colorsDark,
      },
      borders: {
        // widths: [1, 2],
        // radius: [4, 16],
        colors: colorsDark,
      },
      backgrounds: colorsDark,
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.primaryBackground,
        card: colorsDark.primaryBackground,
      },
    },
  },
} as const satisfies ThemeConfiguration;
