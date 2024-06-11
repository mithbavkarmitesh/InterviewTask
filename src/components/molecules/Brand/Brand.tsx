import { DimensionValue, ViewStyle } from "react-native";

import Treefe from "@/theme/assets/images/treefe.png";
import Treefe_Dark from "@/theme/assets/images/treefe_dark.png";

import { BaseView, ImageVariant } from "@/components/atoms";
import { useTheme } from "@/theme";
import { isImageSourcePropType } from "@/types/guards/image";

type Props = {
  height?: DimensionValue;
  width?: DimensionValue;
  mode?: "contain" | "cover" | "stretch" | "repeat" | "center";
  containerStyle?: ViewStyle;
};

function Brand({ height, width, mode, containerStyle }: Props) {
  const { layout } = useTheme();

  if (!isImageSourcePropType(Treefe) || !isImageSourcePropType(Treefe)) {
    throw new Error("Image source is not valid");
  }

  return (
    <BaseView
      testID="brand-img-wrapper"
      style={{ height, width, ...containerStyle }}
    >
      <ImageVariant
        testID="brand-img"
        style={[layout.fullHeight, layout.fullWidth]}
        source={Treefe}
        sourceDark={Treefe_Dark}
        resizeMode={mode}
      />
    </BaseView>
  );
}

Brand.defaultProps = {
  height: 200,
  width: 200,
  mode: "contain",
};

export default Brand;
