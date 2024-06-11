import { BaseText, Button } from "@/components/atoms";
import SubtitleText from "@/components/atoms/Typography/SubTitleText";
import { Card, LikeButton } from "@/components/molecules";
import Images from "@/theme/assets/images";
import { hp, wp } from "@/utils/layoutUtils";
import React, { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { getTimeAgo } from "@/utils/dateutils";
import { useTypedSelector } from "@/store";
import Comments from "@/screens/Comments";
import { Posts } from "../../types";
import { CommentsModalRef } from "@/screens/Comments/types";
import { capitalize } from "lodash";
import { toggleLikes } from "../../helper";
import { getAssetRemoteSource } from "@/utils/fileUtils";
import { PressableOpacity } from "react-native-pressable-opacity";
import { ROUTES } from "@/utils/routes";
import { navigationRef } from "@/navigators/helper";

const PostCardWithText = ({ item }: any) => {
  const [isLiked, setIsLiked] = useState(false);

  const commentModalRef = React.useRef<CommentsModalRef>(null);
  const userInfo = useTypedSelector((state) => state.UserReducer.userInfo);

  const heartOrUnheart = () => {
    toggleLikes(
      !isLiked,
      item?.postId,
      ({ msg, flagHeart }: { msg: string; flagHeart: boolean }) => {
        setIsLiked(flagHeart);
      },
      (err: Error) => {}
    );
  };

  useEffect(() => {
    setIsLiked(item?.hearted);
  }, [item?.hearted]);

  const onUserPress = () => {
    if (
      userInfo?.userName?.value &&
      item?.userName === userInfo?.userName?.value
    ) {
      //@ts-ignore
      navigationRef?.current?.navigate(ROUTES.TABS, {
        screen: ROUTES.PROFILE,
      });
    } else {
      //@ts-ignore
      navigationRef?.current?.navigate(ROUTES.OTHER_USER_PROFILE, {
        user: { username: item?.userName },
      });
    }
  };

  return (
    <>
      <Card
        cardStyle={{
          backgroundColor: "#ADC178",
          marginBottom: 30,
          marginHorizontal: wp(20),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "85%" }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: hp(7),
                alignItems: "center",
              }}
            >
              <PressableOpacity disabledOpacity={0.4} onPress={onUserPress}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={
                      item?.displayPhoto
                        ? {
                            uri: getAssetRemoteSource(item?.displayPhoto),
                          }
                        : Images.images.defaultAvatar
                    }
                    defaultSource={Images.images.defaultAvatar}
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                  <SubtitleText
                    style={{
                      paddingLeft: 10,
                      color: "#1C1C1C",
                      width: "90%",
                      flexShrink: 1,
                    }}
                  >
                    {capitalize(item?.firstName || "") +
                      " " +
                      capitalize(item?.surName || "") || ""}
                  </SubtitleText>
                </View>
              </PressableOpacity>
            </View>

            <BaseText style={{ marginTop: 20, color: "#1C1C1C" }}>
              {item?.postText ||
                "I am going to NYC with my family for this christmas"}
            </BaseText>
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              variant="gradient"
              containerStyle={{
                width: 30,
                height: 30,
                alignItems: "center",
              }}
              title=""
            >
              <Image
                source={Images.icons.friendIcon}
                style={{ width: 20, height: 20, margin: 10 }}
              />
            </Button>
            {/* <Image
              source={Images.icons.downloadIcon}
              style={{ width: 30, height: 30, margin: 10, marginTop: 15 }}
            /> */}
            <PressableOpacity
              onPress={() => commentModalRef.current?.openCommentsModal()}
            >
              <Image
                source={Images.icons.commentIcon}
                style={{ width: 20, height: 20, margin: 10 }}
              />
            </PressableOpacity>
            <LikeButton onPress={heartOrUnheart} isLiked={isLiked} />
          </View>
        </View>
        <View style={{ alignItems: "flex-end", marginTop: 10 }}>
          <BaseText style={{ fontSize: 14, color: "#1C1C1C" }}>
            {getTimeAgo(item?.createdAt)}
          </BaseText>
        </View>
      </Card>
      <Comments ref={commentModalRef} postId={item.postId} />
    </>
  );
};

export default PostCardWithText;
