import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Video, { OnBufferData, OnLoadData, VideoRef } from "react-native-video";

type PropsT = {
  path: string;
};
const VideoComponent = ({ path }: PropsT) => {
  const videoPlayerRef = useRef<VideoRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const onVideoLoadStart = () => {
    
    setIsLoading(true);
  };
  const onLoad = (data: OnLoadData) => {
    
    videoPlayerRef.current?.seek(0);
  };
  const onVideoBuffer = (param: OnBufferData) => {
    

    setIsLoading(param?.isBuffering);
  };
  const onReadyForDisplay = () => {
    
    setIsLoading(false);
  };
  const IndicatorLoadingView = () => {
    if (isLoading) {
      return (
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
          <ActivityIndicator
            color={"#709C3C"}
            size="large"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };
  const onError = (err) => {
    
  };
  return (
    <>
      <Video
        repeat
        ref={videoPlayerRef}
        source={{ uri: path }}
        controls={false}
        playInBackground={false}
        resizeMode="cover"
        paused={false}
        onBuffer={onVideoBuffer}
        onReadyForDisplay={onReadyForDisplay}
        onLoad={onLoad}
        onLoadStart={onVideoLoadStart}
        onError={onError}
        style={{
          // borderRadius: 11,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      />
      <IndicatorLoadingView />
    </>
  );
};

export default VideoComponent;

const styles = StyleSheet.create({});
