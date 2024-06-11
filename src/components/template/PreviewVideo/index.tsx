import React, { useRef, useCallback, useState } from "react";

import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import Video, { VideoRef } from "react-native-video";
import { useTheme } from "@/theme";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CloseIcon } from "@/theme/assets/svg";
import Images from "@/theme/assets/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBackHandler from "@/hooks/useBackHandler";
// item?.remoteUri
export type PreviewVideoType = {
  videoSource: string;
  visible: boolean;
  handleVisibility: () => void;
};
const PreviewVideo = ({
  videoSource,
  visible,
  handleVisibility,
}: PreviewVideoType) => {
  const { top } = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const { layout } = useTheme();

  //States
  const [isPaused, setIsPaused] = useState(false);

  const onVideoLoad = useCallback(() => {
    videoRef?.current?.seek(1);
  }, [videoSource]);

  const handlePlayPause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  useBackHandler(() => {
    handleVisibility();
    return true;
  });

  return (
    <Modal visible={visible} statusBarTranslucent={false}>
      <BlurView
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="black"
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
      />
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={handleVisibility}
          hitSlop={40}
          style={{
            position: "absolute",
            top: top + 15,
            right: 10,
          }}
        >
          <CloseIcon width={35} height={35} />
        </Pressable>
      </View>
      <View style={[layout.flex_1, layout.center, { marginTop: -50 }]}>
        <Video
          ref={videoRef}
          repeat
          source={{ uri: videoSource }}
          style={{
            width: SCREEN_WIDTH,
            height: Math.floor(0.6 * SCREEN_WIDTH),
            overflow: "hidden",
          }}
          controls
          playInBackground={false}
          resizeMode="cover"
          onLoad={onVideoLoad}
          // paused={true /* isPaused */}
        />
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

export default PreviewVideo;

const styles = StyleSheet.create({});
