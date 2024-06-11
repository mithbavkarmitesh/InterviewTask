import React from "react";
import { BaseText, Button } from "@/components/atoms";
import SubtitleText from "@/components/atoms/Typography/SubTitleText";
import { Card, LikeButton } from "@/components/molecules";
import Images from "@/theme/assets/images";
import { getWindowHeight, getWindowWidth, hp, wp } from "@/utils/layoutUtils";
import { Image, Pressable, View } from "react-native";
import { getTimeAgo } from "@/utils/dateutils";
import { useTheme } from "@/theme";
import { Posts } from "../../types";
import Comments from "@/screens/Comments";
import { CommentsModalRef } from "@/screens/Comments/types";
import { ScrollView } from "react-native-gesture-handler";
import {
  downloadImageRemote,
  extractFilenameFromURL,
  getAssetRemoteSource,
} from "@/utils/fileUtils";
import { capitalize, debounce } from "lodash";
import { toggleLikes } from "../../helper";
import { Strings } from "@/constants";
import { useTypedSelector } from "@/store";
import { PressableOpacity } from "react-native-pressable-opacity";
import { navigationRef } from "@/navigators/helper";
import { ROUTES } from "@/utils/routes";

const Image_Width = Math.floor(0.875 * getWindowWidth());
const Image_Height = Math.floor(0.475 * getWindowHeight());
const Dummy_Image_Source = `https://picsum.photos/seed/${
  Math.floor(Math.random() * 100) + 1
}/${Image_Width}/${Image_Height}`;

const ImageCarouselPost = ({ item }: { item: Posts }) => {
  const { colors } = useTheme();
  const commentModalRef = React.useRef<CommentsModalRef>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const userInfo = useTypedSelector((state) => state.UserReducer.userInfo);

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

  const downloadMedia = debounce(
    () =>
      item?.urlsAndFileType?.forEach((media) => {
        if (media?.url) downloadImageRemote(media?.url);
      }),
    1000,
    { leading: true }
  );

  const filenameWithExtension = (url: string) => extractFilenameFromURL(url);

  const getImageSource = (url: string) =>
    url && filenameWithExtension(url)
      ? Strings.CDN_URL.concat(filenameWithExtension(url) || "")
      : Dummy_Image_Source;

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: wp(20),
            }}
          >
            {item?.urlsAndFileType?.map((media, index) => {
              if (media.fileType === "Image") {
                const imageSource = media?.url
                  ? getImageSource(media?.url)
                  : Dummy_Image_Source;

                return (
                  <Image
                    key={index}
                    source={{ uri: imageSource }}
                    style={{
                      width: Image_Width,
                      height: Image_Height,
                      resizeMode: "cover",
                      borderRadius: wp(5),
                      marginHorizontal: index === 0 ? 0 : wp(10),
                    }}
                  />
                );
              }
              return null;
            })}
          </ScrollView>

          <View
            style={{
              right: wp(30),
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
                source={Images.icons.friendIcon}
                style={{ width: 20, height: 20, margin: 10 }}
              />
            </Button>
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flex: 1,
              }}
            >
              <PressableOpacity disabledOpacity={0.4} onPress={downloadMedia}>
                <Image
                  source={Images.icons.downloadIcon}
                  style={{ width: 30, height: 30, margin: 10 }}
                />
              </PressableOpacity>
              <PressableOpacity
                hitSlop={10}
                disabledOpacity={0.4}
                onPress={() => commentModalRef.current?.openCommentsModal()}
              >
                <Image
                  source={Images.icons.commentIcon}
                  style={{ width: 25, height: 25, margin: 10 }}
                />
              </PressableOpacity>
              <LikeButton
                onPress={heartOrUnheart}
                isLiked={isLiked}
                imageStyle={{ width: 25, height: 25, margin: 10 }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: hp(7),
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: wp(20),
          }}
        >
          <PressableOpacity disabledOpacity={0.4} onPress={onUserPress}>
            <View style={{ flexDirection: "row" }}>
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
                style={{
                  paddingLeft: 10,
                  color: colors.postText,
                  width: "80%",
                  flexShrink: 1,
                }}
              >
                {/* {item?.userName || ""} */}
                {capitalize(item?.firstName || "") +
                  " " +
                  capitalize(item?.surName || "") || ""}
              </SubtitleText>
            </View>
          </PressableOpacity>
          <View style={{ paddingLeft: 0 }}>
            <BaseText style={{ fontSize: 14, color: "#7C7C7C" }}>
              {getTimeAgo(item?.createdAt)}
            </BaseText>
          </View>
        </View>
        {item?.postText ? (
          <BaseText
            style={{
              marginTop: 10,
              color: colors.postText,
              paddingHorizontal: wp(20),
            }}
          >
            {item?.postText || ""}
          </BaseText>
        ) : null}
      </Card>
      <Comments ref={commentModalRef} postId={item.postId} />
    </>
  );
};

export default ImageCarouselPost;
