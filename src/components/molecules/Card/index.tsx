import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

import { wp } from "@/utils/layoutUtils";
import { useTheme } from "@/theme";

type TCard = {
  children: React.ReactNode;
  cardStyle?: ViewStyle;
};

const Card = ({ children, cardStyle }: TCard) => {
  const { colors } = useTheme();

  const combinedStyles = [styles.card, cardStyle];
  return <View style={combinedStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    padding: wp(12),
    borderRadius: wp(5),
    // Add any other styles you need for your card
  },
});

export default Card;
