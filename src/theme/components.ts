import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import type { ComponentTheme } from "@/types/theme/theme";
import { wp } from "@/utils/layoutUtils";

export default ({ layout, backgrounds, fonts }: ComponentTheme) => {
  return {
    buttonCircle: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      ...backgrounds.purple100,
      ...fonts.gray400,
      height: 70,
      width: 70,
      borderRadius: 35,
    },
    circle250: {
      borderRadius: 140,
      height: 250,
      width: 250,
    },
    button: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      ...fonts.gray,
      width: "100%",
      borderRadius: wp(5),
    },
  } as const satisfies Record<string, ImageStyle | TextStyle | ViewStyle>;
};
