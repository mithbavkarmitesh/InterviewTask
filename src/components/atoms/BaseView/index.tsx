// BaseView.tsx
import { useTheme } from "@/theme";
import React, { FC, ReactNode } from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  ViewProps as RNViewProps,
} from "react-native";

interface BaseViewProps extends Omit<RNViewProps, "style"> {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  row?: boolean;
}

const BaseView: FC<BaseViewProps> = ({
  children,
  style,
  row,
  ...restProps
}) => {
  const { backgrounds } = useTheme();
  const flexDirectionStyle: StyleProp<ViewStyle> = row
    ? { flexDirection: "row" }
    : {};
  const combinedStyles = [
    defaultStyle,
    backgrounds.primaryBackground,
    flexDirectionStyle,
    style,
  ];
  return (
    <View style={combinedStyles} {...restProps}>
      {children}
    </View>
  );
};

const defaultStyle: ViewStyle = {
  // Add any default styles for your BaseView
};

export default BaseView;
