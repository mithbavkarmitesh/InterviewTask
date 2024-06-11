import { ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Images from "@/theme/assets/images";

const ScreenBackgroundContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      imageStyle={{
        width: "100%",
        height: "100%",
        opacity: 0.2,
        marginTop: insets.top,
      }}
      source={Images.images.mainBackground}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      {children}
    </ImageBackground>
  );
};

export default ScreenBackgroundContainer;
