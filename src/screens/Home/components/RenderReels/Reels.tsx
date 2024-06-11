import React, { forwardRef, useMemo, useState } from "react";
import { Button } from "@/components/atoms";
import { Card } from "@/components/molecules";
import Images from "@/theme/assets/images";
import { getWindowHeight, getWindowWidth, wp } from "@/utils/layoutUtils";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import { useTheme } from "@/theme";
import { SingleReel } from "../../types";
import Comments from "@/screens/Comments";
import { CommentsModalRef } from "@/screens/Comments/types";
import Video, { OnBufferData, OnLoadData, VideoRef } from "react-native-video";
import { PlayIcon } from "@/theme/assets/svg";
import { extractFilenameFromURL } from "@/utils/fileUtils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Strings } from "@/constants";

const Dummy_Video_Source =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const Video_Width = Math.floor(0.875 * getWindowWidth());
const Video_Height = Math.floor(0.669 * getWindowHeight());

const Reels = forwardRef(
  (
    {
      item,
      isVideoVisible,
      index,
    }: { item: SingleReel; isVideoVisible: boolean; index: number },
    parentRef
  ) => {
    const bottomTabHeight = useBottomTabBarHeight();

    const { colors } = useTheme();
    const commentModalRef = React.useRef<CommentsModalRef>(null);
    const ref = React.useRef<VideoRef>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paused, setIsPaused] = useState(false);
    React.useImperativeHandle(parentRef, () => ({
      play,
      unload,
      stop,
    }));
    React.useEffect(() => {
      if (isVideoVisible && paused) {
        setIsPaused(false);
      }
    }, [isVideoVisible]);

    // React.useEffect(() => {
    //   return () => unload();
    // }, []);

    /**
     * Plays the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const play = async () => {
      if (ref.current == null) {
        return;
      }

      // if video is already playing return
      const status = await ref.current?.getStatusAsync();
      if (status?.isPlaying) {
        return;
      }
      try {
        await ref.current?.play();
      } catch (e) {
        
      }
    };
    /**
     * Stops the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const stop = async () => {
      if (ref.current == null) {
        return;
      }

      // if video is already stopped return
      const status = await ref.current.getStatusAsync();
      if (!status?.isPlaying) {
        return;
      }
      try {
        await ref.current.stopAsync();
      } catch (e) {
        
      }
    };

    /**
     * Unloads the video in the component if the ref
     * of the video is not null.
     *
     * This will make sure unnecessary video instances are
     * not in memory at all times
     *
     * @returns {void}
     */
    const unload = async () => {
      if (ref.current == null) {
        return;
      }

      // if video is already stopped return
      try {
        await ref.current?.unloadAsync();
      } catch (e) {
        
      }
    };
    const onVideoLoadStart = () => {
      
      setIsLoading(true);
    };
    const onLoad = (data: OnLoadData) => {
      
      ref.current?.seek(0);
    };
    const onVideoBuffer = (param: OnBufferData) => {
      
      setIsLoading(param?.isBuffering);
    };
    const onReadyForDisplay = () => {
      
      setIsLoading(false);
    };
    const PosterUrl = useMemo(
      () =>
        `https://picsum.photos/seed/${
          Math.floor(Math.random() * 100) + 1
        }/${Video_Width}/${Video_Height}`,
      []
    );
    

    const IndicatorLoadingView = () => {
      if (isLoading && isVideoVisible) {
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

    const filenameWithExtension = extractFilenameFromURL(
      item?.reelsWithFileType?.url
    );
    const videoSource =
      item?.reelsWithFileType?.url && filenameWithExtension
        ? Strings.CDN_URL.concat(filenameWithExtension)
        : item?.reelsWithFileType?.url || Dummy_Video_Source;

    return (
      <>
        <Card
          cardStyle={{
            padding: 0,
            borderRadius: 20,
            zIndex: 1,
          }}
        >
          <View
            style={{
              borderRadius: wp(5),
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Pressable
              style={{
                backgroundColor: isVideoVisible
                  ? undefined
                  : "rgba(0, 0, 0, 0.5)",
              }}
              onPress={() => {
                setIsPaused((prev) => !prev);
              }}
            >
              <Video
                ref={ref}
                repeat
                source={{
                  uri: videoSource,
                }}
                style={{
                  width: Math.floor(0.875 * getWindowWidth()),
                  height: Math.floor(0.64 * getWindowHeight()),
                  borderRadius: 5,
                  overflow: "hidden",
                }}
                controls={false}
                playInBackground={false}
                resizeMode="cover"
                onLoadStart={onVideoLoadStart}
                onLoad={onLoad}
                paused={!isVideoVisible || paused}
                onBuffer={onVideoBuffer}
                onReadyForDisplay={onReadyForDisplay}
              />
              {IndicatorLoadingView()}
              {!isVideoVisible || paused ? (
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
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PlayIcon width={40} height={40} />
                  </View>
                </View>
              ) : null}
            </Pressable>

            <View
              style={{
                right: wp(12),
                bottom: 0,
                height: "100%",
                position: "absolute",
              }}
            >
              <Button
                onPress={() => {}}
                variant="gradient"
                containerStyle={{ top: 10, right: 0 }}
              >
                <Image
                  source={Images.icons.followIcon}
                  style={{ width: 20, height: 20, margin: 10 }}
                />
              </Button>
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flex: 1,
                  bottom: 20,
                }}
              >
                {/* <Image
                  source={Images.icons.downloadIcon}
                  style={{ width: 30, height: 30, margin: 10 }}
                /> */}
                <Pressable
                  onPress={() => commentModalRef.current?.openCommentsModal()}
                >
                  <Image
                    source={Images.icons.commentIcon}
                    style={{ width: 30, height: 30, margin: 10 }}
                  />
                </Pressable>
                <Image
                  source={Images.icons.likeIcon}
                  style={{ width: 30, height: 30, margin: 10 }}
                />
                <Image
                  source={
                    item?.displayPhoto
                      ? { uri: item?.displayPhoto }
                      : Images.images.defaultAvatar
                  }
                  defaultSource={Images.images.defaultAvatar}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              </View>
            </View>
          </View>
        </Card>
        <Comments ref={commentModalRef} postId={item.reelsId} />
        <View
          style={{ width: wp(10), height: Math.floor(0.6 * getWindowHeight()) }}
        />
      </>
    );
  }
);

export default Reels;
