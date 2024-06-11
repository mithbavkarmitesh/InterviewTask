import React, { useMemo } from "react";
import { BaseText, Button } from "@/components/atoms";
import SubtitleText from "@/components/atoms/Typography/SubTitleText";
import { Card, LikeButton } from "@/components/molecules";
import Images from "@/theme/assets/images";
import { getWindowHeight, getWindowWidth, hp, wp } from "@/utils/layoutUtils";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { getTimeAgo } from "@/utils/dateutils";
import { useTheme } from "@/theme";
import { Posts } from "../../types";
import Comments from "@/screens/Comments";
import { CommentsModalRef } from "@/screens/Comments/types";
import Video, { OnLoadData, VideoRef } from "react-native-video";
import { PlayIcon } from "@/theme/assets/svg";
import { debounce } from "lodash";
import {
  downloadImageRemote,
  extractFilenameFromURL,
  getAssetRemoteSource,
} from "@/utils/fileUtils";
import layout from "@/theme/layout";
import { toggleLikes } from "../../helper";
import { Strings } from "@/constants";
import { useTypedSelector } from "@/store";
import { PressableOpacity } from "react-native-pressable-opacity";
import { ROUTES } from "@/utils/routes";
import { navigationRef } from "@/navigators/helper";

const Video_Width = Math.floor(0.875 * getWindowWidth());
const Video_Height = Math.floor(0.475 * getWindowHeight());
const Dummy_Video_Source =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const VideoPost = ({
  item,
  isVideoVisible,
}: {
  item: Posts;
  isVideoVisible: boolean;
}) => {
  const { colors } = useTheme();
  const videoPlayerRef = React.useRef<VideoRef>(null);
  const commentModalRef = React.useRef<CommentsModalRef>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const userInfo = useTypedSelector((state) => state.UserReducer.userInfo);

  const heartOrUnheart = debounce(
    () => {
      toggleLikes(
        !isLiked,
        item?.postId,
        ({ msg, flagHeart }: { msg: string; flagHeart: boolean }) => {
          setIsLiked(flagHeart);
        },
        (err: Error) => {}
      );
    },
    1000,
    { leading: true }
  );

  React.useEffect(() => {
    setIsLiked(item?.hearted);
  }, [item?.hearted]);

  const onVideoLoadStart = () => {
    // this.setState({isLoading: true});
  };
  const onLoad = (data: OnLoadData) => {
    // this will set first frame of video as thumbnail
    videoPlayerRef.current?.seek(0);
  };

  const onUserPress = () => {
    if (
      userInfo?.userName?.value &&
      item?.userName === userInfo?.userName?.value
    ) {
      //@ts-ignore
      navigationRef.current?.navigate(ROUTES.TABS, {
        screen: ROUTES.PROFILE,
      });
    } else {
      //@ts-ignore
      navigationRef.navigate(ROUTES.OTHER_USER_PROFILE, {
        user: { username: item?.userName },
      });
    }
  };

  const PosterUrl = useMemo(
    () =>
      `https://picsum.photos/seed/${
        Math.floor(Math.random() * 100) + 1
      }/${Video_Width}/${Video_Height}`,
    []
  );

  const onVideoEnd = () => {
    videoPlayerRef?.current?.seek(0);
  };

  const downloadMedia = debounce(
    () =>
      item?.urlsAndFileType?.forEach((media) => {
        if (media?.url) downloadImageRemote(media?.url);
      }),
    1000,
    { leading: true }
  );
  const filenameWithExtension =
    item?.urlsAndFileType?.[0]?.url &&
    extractFilenameFromURL(item?.urlsAndFileType?.[0]?.url);
  const videoSource =
    item?.urlsAndFileType?.[0]?.url && filenameWithExtension
      ? Strings.CDN_URL.concat(filenameWithExtension)
      : item?.urlsAndFileType?.[0]?.url || Dummy_Video_Source;

  if (!item?.urlsAndFileType?.[0]?.url) {
    return null;
  }

  return (
    <>
      <Card
        cardStyle={{
          padding: 0,
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            borderRadius: wp(5),
            width: "100%",
          }}
        >
          <Pressable style={{ paddingLeft: wp(20) /*  zIndex: 2 */ }}>
            <Video
              ref={videoPlayerRef}
              source={{ uri: videoSource }}
              style={styles.videoPlayer}
              onBuffer={({ isBuffering }) => {}}
              controls={false}
              repeat
              playInBackground={false}
              resizeMode="cover"
              onLoadStart={onVideoLoadStart}
              onLoad={onLoad}
              onEnd={onVideoEnd}
              paused={!isVideoVisible}
              // poster={PosterUrl}
              // posterStyle={{ resizeMode: "contain", height: "100%" }}
            />
            {!isVideoVisible ? (
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

          <View style={styles.sidebarContainer}>
            <Button
              onPress={() => {}}
              variant="gradient"
              containerStyle={{ top: 10, right: 0 }}
            >
              <Image
                source={Images.icons.friendIcon}
                style={{ width: 20, height: 20, margin: 10 }}
              />
            </Button>
            <View style={styles.actionButtonContainer}>
              <Pressable onPress={downloadMedia}>
                <Image
                  source={Images.icons.downloadIcon}
                  style={{ width: 30, height: 30, margin: 10 }}
                />
              </Pressable>
              <Pressable
                onPress={() => commentModalRef.current?.openCommentsModal()}
                style={{ elevation: 5 }}
              >
                <Image
                  source={Images.icons.commentIcon}
                  style={{
                    width: 25,
                    height: 25,
                    margin: 10,
                  }}
                />
              </Pressable>
              <LikeButton
                onPress={heartOrUnheart}
                isLiked={isLiked}
                imageStyle={{ width: 25, height: 25, margin: 10 }}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <PressableOpacity disabledOpacity={0.4} onPress={onUserPress}>
            <View style={layout.row}>
              <Image
                source={
                  item?.displayPhoto
                    ? {
                        uri: getAssetRemoteSource(item?.displayPhoto),
                      }
                    : Images.images.defaultAvatar
                }
                defaultSource={Images.images.defaultAvatar}
                style={{ width: 20, height: 20, borderRadius: 10 }}
              />
              <SubtitleText
                style={[styles.userNameText, { color: colors.postText }]}
              >
                {item?.userName || ""}
              </SubtitleText>
            </View>
          </PressableOpacity>
          <View>
            <BaseText style={styles.timestampText}>
              {getTimeAgo(item?.createdAt)}
            </BaseText>
          </View>
        </View>
        <BaseText style={[styles.postText, { color: colors.postText }]}>
          {item?.postText || ""}
        </BaseText>
      </Card>
      <Comments ref={commentModalRef} postId={item.postId} />
    </>
  );
};

export default VideoPost;

const styles = StyleSheet.create({
  userNameText: { paddingLeft: 10 },
  timestampText: { paddingLeft: 10, fontSize: 14, color: "#7C7C7C" },
  postText: {
    marginTop: 10,
    paddingHorizontal: wp(20),
  },
  footer: {
    flexDirection: "row",
    marginTop: hp(7),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(20),
  },
  actionButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  sidebarContainer: {
    right: wp(37),
    bottom: 0,
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  videoPlayer: {
    width: Video_Width,
    height: Video_Height,
    borderRadius: wp(5),
  },
});
