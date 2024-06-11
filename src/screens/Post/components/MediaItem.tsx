import {
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { MediaList } from "../types";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
import { IS_ANDROID, wp } from "@/utils/layoutUtils";
import PostHelper from "../helper";
import { getAssetDataFromPath } from "@/utils/fileUtils";
import Video, { VideoRef } from "react-native-video";
import { PlayIcon } from "@/theme/assets/svg";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import { PreviewVideo } from "@/components/template";
import { TouchableOpacity } from "react-native-gesture-handler";
import { omit } from "lodash";
const numColumns = 3;
const screenWidth = Dimensions.get("window").width;

const MediaItem = ({
  item,
  onRemoveMedia,
  allProgress,
}: {
  item: MediaList;
  onRemoveMedia: () => void;
  allProgress: any;
}) => {
  const { layout, colors } = useTheme();

  // 
  // 
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const { fileName, extension } = getAssetDataFromPath(item?.path);
  const videoRef = useRef<VideoRef>(null);

  const onVideoLoad = useCallback(() => {
    videoRef?.current?.seek(0);
  }, [item]);
  

  const playButtonPressHandler = () => {
    
    setPreviewModalVisible(!previewModalVisible);
  };

  return (
    <View style={{ zIndex: 2 }}>
      {previewModalVisible ? (
        <PreviewVideo
          videoSource={item?.remoteUri || item?.path}
          visible={previewModalVisible}
          handleVisibility={playButtonPressHandler}
        />
      ) : null}
      {fileName &&
      allProgress[fileName] &&
      allProgress[fileName] > 0 &&
      allProgress[fileName] < 100 ? (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1 }, layout.center]}>
          <ActivityIndicator focusable size="large" color={colors.green} />
        </View>
      ) : null}
      {PostHelper.getMediaType(item) === "image" ? (
        <Image
          source={{ uri: item?.path || item?.remoteUri }}
          defaultSource={{ uri: item?.path }}
          style={styles.image}
          resizeMode="cover"
          onError={(error: any) => {
            
          }}
        />
      ) : PostHelper.getMediaType(item) === "video" ? (
        <Pressable onPress={playButtonPressHandler} style={{ zIndex: 1 }}>
          <Video
            ref={videoRef}
            repeat
            source={{ uri: item?.remoteUri }}
            style={{
              ...styles.image,
              borderRadius: 5,
              overflow: "hidden",
              height: 200,
              width: 200,
            }}
            controls={false}
            playInBackground={false}
            resizeMode="cover"
            onLoad={onVideoLoad}
            paused={true}
          />
          <View
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
            <View
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
            </View>
          </View>
        </Pressable>
      ) : null}

      <Pressable
        hitSlop={30}
        style={[layout.absolute, layout.center, styles.deleteButton]}
        onPress={onRemoveMedia}
      >
        <Image
          source={Images.icons.crossIcon}
          style={{ width: 10, height: 10 }}
        />
      </Pressable>
    </View>
  );
};

export default MediaItem;

const styles = StyleSheet.create({
  image: {
    width: Math.floor(screenWidth / numColumns) - wp(20), // Adjust the width based on the number of columns
    height: Math.floor(screenWidth / numColumns) - wp(20), // Adjust the height based on the number of columns
    marginVertical: 10,
    marginHorizontal: 2,
  },
  deleteButton: {
    backgroundColor: "red",
    height: 20,
    width: 20,
    borderRadius: 10,
    right: -2,
    top: 8,
    zIndex: 2,
  },
});
