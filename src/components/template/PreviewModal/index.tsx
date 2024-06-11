import React, { useRef, useCallback, useState } from "react";

import { Image, Modal, StyleSheet, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import Video, { VideoRef } from "react-native-video";
import { useTheme } from "@/theme";
import { CloseIcon } from "@/theme/assets/svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableOpacity } from "react-native-pressable-opacity";
import { getWindowHeight, getWindowWidth } from "@/utils/layoutUtils";
// import useBackHandler from "@/hooks/useBackHandler";

const Video_Width = Math.floor(0.875 * getWindowWidth());
const Video_Height = Math.floor(0.475 * getWindowHeight());

export type PreviewVideoType = {
  source: string;
  visible: boolean;
  type: string;
  handleVisibility: () => void;
};
const PreviewModal = ({
  source,
  visible,
  type,
  handleVisibility,
}: PreviewVideoType) => {
  const { top } = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const { layout } = useTheme();

  //States
  const [isPaused, setIsPaused] = useState(false);

  const onVideoLoad = useCallback(() => {
    videoRef?.current?.seek(1);
  }, [source]);

  const handlePlayPause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  return (
    <Modal visible={visible} statusBarTranslucent={false}>
      <BlurView
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="black"
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
      />

      <PressableOpacity
        onPress={handleVisibility}
        hitSlop={40}
        style={[
          styles.pressStyle,
          {
            top: top + 15,
          },
        ]}
      >
        <CloseIcon width={35} height={35} />
      </PressableOpacity>

      <View style={[layout.flex_1, layout.center, { marginTop: -50 }]}>
        {type === "image" ? (
          <>
            <Image
              source={{ uri: source }}
              style={{
                width: Video_Width,
                height: Video_Height,
                borderRadius: 11,
              }}
              resizeMode="cover"
            />
          </>
        ) : type === "video" ? (
          <Video
            ref={videoRef}
            repeat
            source={{ uri: source }}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            controls
            playInBackground={false}
            resizeMode="cover"
            onLoad={onVideoLoad}
            fullscreen={true}
          />
        ) : null}
        {/* <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              onPress={handlePlayPause}
              style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                height: 40,
                width: 40,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlayIcon width={20} height={20} />
            </TouchableOpacity>
          </View> */}
      </View>
    </Modal>
  );
};

export default PreviewModal;

const styles = StyleSheet.create({
  pressStyle: {
    position: "absolute",
    right: 10,
    zIndex: 2,
  },
});
