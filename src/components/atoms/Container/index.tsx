// Container.tsx
import React, { FC, ReactNode } from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import BaseView from "../BaseView";
import { wp } from "@/utils/layoutUtils";

interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>; // External styles prop
}

const Container: FC<ContainerProps> = ({ children, style }) => {
  return <BaseView style={[styles.container, style]}>{children}</BaseView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
});

export default Container;
