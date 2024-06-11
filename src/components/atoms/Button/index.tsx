import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BaseText from "../BaseText";
import { useTheme } from "@/theme";
import { hp } from "@/utils/layoutUtils";

interface GenericButtonProps extends TouchableOpacityProps {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  gradientColors?: string[];
  variant: "gradient" | "normal";
  children?: React.ReactNode;
  isLoading?: boolean;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  title,
  onPress,
  containerStyle,
  disabled,
  textStyle,
  gradientColors,
  children,
  variant = "normal",
  isLoading = false,
  ...props
}) => {
  const { colors, fonts } = useTheme();

  const combinedStyles = StyleSheet.flatten([
    styles.confirmButton,
    containerStyle,
    disabled && { ...styles.disabledButton },
  ]);

  const textCombinedStyles = StyleSheet.flatten([
    styles.buttonText,
    fonts.white,
    textStyle,
    disabled && styles.disabledText,
  ]);

  const linearGradientColors = gradientColors
    ? gradientColors
    : disabled
    ? [colors.gray, colors.gray]
    : [colors.gradient1, colors.gradient2];

  if (variant === "gradient") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        {...props}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={linearGradientColors}
          style={combinedStyles}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={colors.white} style={{}} />
          ) : title ? (
            <BaseText style={textCombinedStyles}>{title}</BaseText>
          ) : (
            children
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={combinedStyles}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.cursorColor}
          style={{ paddingVertical: 14 }}
        />
      ) : title ? (
        <BaseText style={textCombinedStyles}>{title}</BaseText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    textAlign: "center",
  },
  confirmButton: {
    // flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    height: 40,
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  disabledText: {
    color: "#FFFFFF",
  },
});

export default GenericButton;
