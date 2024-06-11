// TextAtom.tsx
import React, { FC, ReactNode } from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@/theme";
import { staticFontStyles } from "@/theme/fonts";

export interface BaseTextProps extends Omit<TextProps, "style"> {
  children: ReactNode;
  textWeight?: "regular" | "medium" | "bold" | "semiBold";
  style?: StyleProp<TextStyle>;
}

const BaseText: FC<BaseTextProps> = ({
  children,
  textWeight = "regular",
  style,
  ...restProps
}) => {
  const { fonts } = useTheme();
  const textStyle: TextStyle = {
    ...defaultStyle,
    ...weightStyles[textWeight],
  };

  return (
    <Text style={[textStyle, fonts.baseTextColor, style]} {...restProps}>
      {children}
    </Text>
  );
};

const defaultStyle: TextStyle = {
  fontSize: 16,
  color: "black",

  // Add any other default styles as needed
};

const weightStyles: Record<string, TextStyle> = {
  regular: {
    fontWeight: "normal",
    ...staticFontStyles.regularFont,
  },
  medium: {
    fontWeight: "500",
    ...staticFontStyles.mediumFont,
  },
  bold: {
    fontWeight: "bold",
    ...staticFontStyles.boldFont,
  },
  semiBold: {
    fontWeight: "600",
    ...staticFontStyles.semiBoldFont,
  },
};

export default BaseText;
