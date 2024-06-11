// GenericTextInputAtom.tsx

import React, { FC, ReactNode, forwardRef, ForwardedRef, useRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  TextStyle,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Pressable,
  Keyboard,
} from "react-native";
import { IS_IOS, hp, wp } from "@/utils/layoutUtils";
import { useTheme } from "@/theme";
import BaseText from "../BaseText";
import { PressableOpacity } from "react-native-pressable-opacity";

interface GenericTextInputProps<T>
  extends Omit<TextInputProps, "value" | "onChangeText" | "placeholder"> {
  value: T;
  onChangeText: (text: T) => void;
  placeholder?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onlyAlphabets?: boolean;
  onlyNumbers?: boolean;
  noEmojis?: boolean;
  hasError?: boolean;
  errorText?: string;
  onViewPress?: () => void;
}

const CustomInputWithPlaceholder = forwardRef<
  RNTextInput,
  GenericTextInputProps<string>
>(
  (
    {
      value,
      onChangeText,
      placeholder,
      leftComponent,
      rightComponent,
      containerStyle,
      inputStyle,
      onlyAlphabets,
      onlyNumbers,
      noEmojis = true,
      hasError = false,
      errorText = "",
      onViewPress = () => {},
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<RNTextInput>(null);
    const { colors, backgrounds, fonts } = useTheme();
    const [isFocused, setFocused] = React.useState(false);
    const validateAlphabets = (inputText: string) => {
      const regex = /^[a-zA-Z\s]+$/;
      return regex.test(inputText);
    };

    const handleTextChange = (inputText: string) => {
      let filteredText = inputText;

      // Only allow alphabets
      if (onlyAlphabets && (validateAlphabets(inputText) || inputText === "")) {
        onChangeText(inputText);
        return;
      }

      // Only allow numbers
      if (onlyNumbers) {
        filteredText = filteredText.replace(/[^0-9]/g, "");
        onChangeText(filteredText);
        return;
      }

      // Remove emojis
      // if (noEmojis) {
      //   filteredText = filteredText.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
      // }

      onChangeText(filteredText);
    };
    const combinedTextStyles = [
      { ...styles.input, color: colors.cursorColor },
      backgrounds.textInputBackground,
      inputStyle,
    ];

    return (
      <>
        <Pressable
          style={[
            styles.container,
            backgrounds.textInputBackground,
            containerStyle,
            hasError ? styles.errorStyle : {},
          ]}
          onPress={onViewPress}
        >
          {leftComponent && (
            <View style={styles.leftComponent}>{leftComponent}</View>
          )}
          <View
            style={{
              position: "absolute",
              width: "100%",
              paddingHorizontal: wp(14),
              zIndex: 1,
            }}
          >
            {/* <View
              style={{
                zIndex: -1,
                position: "absolute",
                backgroundColor: "red",
              }}
            > */}
            {value.length > 0 /* || isFocused */ ? null : (
              <PressableOpacity
                onPress={() => {
                  inputRef?.current?.focus();
                }}
                style={{
                  flexDirection: "row",
                }}
              >
                <BaseText
                  style={[
                    fonts.regularFont,
                    fonts.size_14,
                    { color: "#709C3C" },
                  ]}
                >
                  {placeholder?.slice(0, placeholder?.length - 1)}
                </BaseText>
                <BaseText
                  style={[fonts.regularFont, fonts.size_14, { color: "red" }]}
                >
                  *
                </BaseText>
              </PressableOpacity>
            )}
            {/* </View> */}
          </View>
          <RNTextInput
            ref={inputRef}
            style={combinedTextStyles}
            value={value}
            onChangeText={onChangeText}
            // placeholder={placeholder}
            underlineColorAndroid={"transparent"}
            selectionColor={IS_IOS ? undefined : colors.secondaryBackground}
            cursorColor={colors.green}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {rightComponent && (
            <View style={styles.rightComponent}>{rightComponent}</View>
          )}
          {props?.maxLength === 500 && (
            <View style={{ right: 4, bottom: 4, position: "absolute" }}>
              <BaseText style={fonts.size_12}>(400-500 characters)</BaseText>
            </View>
          )}
        </Pressable>
        {hasError && errorText.length ? (
          <BaseText style={styles.errorText}>{errorText}</BaseText>
        ) : null}
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // height: 40,
    paddingVertical: hp(4),
    borderColor: "#709C3C",
    borderWidth: 1,
    borderRadius: wp(5),
    marginBottom: hp(20),
    paddingHorizontal: wp(10),
  },
  errorStyle: {
    borderColor: "red",
    marginBottom: hp(0),
  },
  errorText: {
    marginBottom: hp(20),
    color: "red",
    fontSize: 14,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  leftComponent: {
    marginRight: 10,
  },
  rightComponent: {
    marginLeft: 10,
  },
});

export default CustomInputWithPlaceholder;
