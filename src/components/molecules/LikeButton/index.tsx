import { useEffect } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Images from "@/theme/assets/images";

interface LikeButtonProps {
  isLiked: boolean;
  onPress: () => void;
  imageStyle?: StyleProp<ImageStyle>;
}
const LikeButton = ({ isLiked, onPress, imageStyle }: LikeButtonProps) => {
  const liked = useSharedValue(0);

  useEffect(() => {
    liked.value = isLiked ? 1 : 0;
  }, [isLiked]);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });

  return (
    <TouchableOpacity
      onPress={() => {
        liked.value = withSpring(liked.value ? 0 : 1);
        onPress();
      }}
      hitSlop={20}
    >
      <Animated.View style={[outlineStyle, StyleSheet.absoluteFillObject]}>
        <Image
          source={Images.icons.likeIcon}
          style={[{ width: 20, height: 20, margin: 10 }, imageStyle]}
        />
      </Animated.View>
      <Animated.View style={[fillStyle]}>
        <Image
          source={Images.icons.heartIcon}
          style={[{ width: 20, height: 20, margin: 10 }, imageStyle]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
export default LikeButton;
