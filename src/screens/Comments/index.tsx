import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Image,
  Pressable,
  Alert,
  useWindowDimensions,
  Text,
  ListRenderItemInfo,
  BackHandler,
  Keyboard,
  StyleSheet,
} from "react-native";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
import { BaseText, BaseView, CustomTextInput } from "@/components/atoms";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IS_IOS, hp, wp } from "@/utils/layoutUtils";
import {
  BottomSheetDefaultFooterProps,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { CommentsModalRef } from "./types";
import {
  getAllCommentsForApost,
  makeCommentOnAPost,
} from "@/services/comments";
import layout from "@/theme/layout";
import { getAssetRemoteSource } from "@/utils/fileUtils";
import { useTypedDispatch, useTypedSelector } from "@/store";
import { showFullScreenLoader } from "@/store/commonSlice";

interface CommentsModalProps {
  postId: string;
}

const Comments = forwardRef<CommentsModalRef, CommentsModalProps>(
  (props, ref) => {
    const { postId } = props;
    const { colors, variant } = useTheme();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const [comment, setComment] = useState(""); // State to manage the comment input
    const [comments, setComments] = useState([]); // State to manage the list of comments
    const snapPoints = useMemo(() => ["50%", height], []);
    const dispatch = useTypedDispatch();
    const { userInfo } = useTypedSelector((store) => store.UserReducer);
    const { dismiss, dismissAll } = useBottomSheetModal();

    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

    const IS_DARK = variant === "dark";

    // Expose imperative functions to the parent component
    useImperativeHandle(ref, () => ({
      openCommentsModal: () => {
        bottomSheetModalRef.current?.present();
      },
      closeCommentsModal: closeCommentsModal,
    }));

    /**
     * Close the comment modal
     *
     */
    const closeCommentsModal = () => {
      bottomSheetModalRef.current?.dismiss();
    };
    /**
     * Close the comments modal when hardware back button is pressed
     */
    // const handler = () => {
    //   

    //   dismiss("commentsModal");
    //   
    //   return true;
    // };

    // useEffect(() => {
    //   BackHandler.addEventListener("hardwareBackPress", handler);

    //   return () =>
    //     BackHandler.removeEventListener("hardwareBackPress", handler);
    // }, []);

    /**
     *
     * @param postId
     */
    const fetchComments = async (postId: any) => {
      try {
        
        const response = await getAllCommentsForApost({ postId, page: 0 });
        
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        
      }
    };

    const renderFooter = useCallback((props: BottomSheetFooterProps) => {
      const [comment, setComment] = useState("");
      const onChange = (text: string) => setComment(text);
      const commentOnAPost = async () => {
        Keyboard.dismiss();
        try {
          dispatch(showFullScreenLoader(true));
          await makeCommentOnAPost({ postId, comment });
          await fetchComments(postId);
        } catch (error) {
          
        } finally {
          setComment("");
          dispatch(showFullScreenLoader(false));
        }
      };
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <BaseView
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: wp(20),
              height: hp(40),
              backgroundColor: colors.topicBackground,
            }}
          >
            <Image
              source={
                userInfo?.displayPhoto?.value
                  ? { uri: userInfo?.displayPhoto?.value }
                  : Images.images.defaultAvatar
              }
              style={{ height: 30, width: 30, borderRadius: 15 }}
            />

            <BottomSheetTextInput
              multiline
              // autoFocus
              value={comment}
              placeholderTextColor={IS_DARK ? "#E4E8D7" : "#2C2C2C"}
              onChangeText={onChange}
              placeholder="Add your comment.."
              returnKeyType="send"
              returnKeyLabel="Send"
              keyboardType="default"
              onSubmitEditing={commentOnAPost}
              underlineColorAndroid={"transparent"}
              selectionColor={IS_IOS ? undefined : colors.secondaryBackground}
              cursorColor={colors.green}
              style={{
                color: colors.cursorColor,
                fontSize: 16,
                lineHeight: 20,
                padding: 8,
                marginHorizontal: 5,
                width: "78%",
                backgroundColor: colors.textInputBackground,
              }}
            />
            <Pressable onPress={commentOnAPost} hitSlop={20}>
              <Image
                source={Images.icons.backIcon}
                style={[
                  styles.backIconStyle,
                  {
                    tintColor: IS_DARK ? "#FFF" : undefined,
                  },
                ]}
              />
            </Pressable>
          </BaseView>
        </BottomSheetFooter>
      );
    }, []);
    const renderItem = ({ item }: ListRenderItemInfo<any>) => {
      const { commentText, firstName, surName, displayPhoto } = item;

      return (
        <View style={styles.renderItemStyle}>
          <Image
            source={
              displayPhoto
                ? { uri: getAssetRemoteSource(displayPhoto) }
                : Images.images.defaultAvatar
            }
            defaultSource={Images.images.defaultAvatar}
            style={styles.avatarStyle}
          />
          <View style={{ paddingLeft: 10, minWidth: "80%" }}>
            <BaseText style={{ fontSize: 12, color: colors.topicTextColor }}>
              {`${firstName || ""} ${surName || ""}` || "Ravi_k"}
            </BaseText>
            <BaseText
              textWeight="medium"
              adjustsFontSizeToFit
              allowFontScaling
              style={{
                maxWidth: "95%",
                fontSize: 11,
                paddingTop: 2.5,
                color: colors.topicTextColor,
              }}
            >
              {commentText}
            </BaseText>
          </View>
        </View>
      );
    };

    const handleSheetChanges = useCallback((index: number) => {
      if (index === 1 && postId) {
        fetchComments(postId);
      }
    }, []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    const _ListEmptyComponent = useCallback(() => {
      return (
        <View style={(layout.flex_1, layout.center)}>
          <BaseText
            style={{
              fontSize: 16,
              color: colors.topicTextColor,
              marginTop: 150,
            }}
          >
            No comments yet
          </BaseText>
          <BaseText style={{ fontSize: 14, color: colors.topicTextColor }}>
            Be the first to break it with your thoughts!
          </BaseText>
        </View>
      );
    }, []);

    return (
      <BottomSheetModal
        name="commentsModal"
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={1} // Initial snap point index
        enableDismissOnClose
        topInset={insets.top}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        animateOnMount={true}
        enableContentPanningGesture={true} // Enable content panning gesture
        // containerHeight={600} // Custom container height
        stackBehavior="replace"
        // backgroundComponent={({ style }) => (
        //   <View style={[style, { backgroundColor: "#E4E8D7" }]}>
        //     <Pressable
        //       hitSlop={30}
        //       onPress={() => {
        //         bottomSheetModalRef.current?.dismiss();
        //       }}
        //       style={{
        //         justifyContent: "center",
        //         paddingHorizontal: 20,
        //         height: 34,
        //         backgroundColor: colors.white,
        //       }}
        //     >
        //       <Image
        //         source={Images.icons.backIcon}
        //         style={{ height: 20, width: 20, tintColor: "black" }}
        //       />
        //     </Pressable>
        //   </View>
        // )}
        footerComponent={renderFooter}
        backdropComponent={renderBackdrop}
        handleStyle={[
          styles.modalHandle,
          {
            backgroundColor: IS_DARK ? "#1C1C1C" : "#FFFFFF",
          },
        ]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
      >
        <BaseView style={layout.flex_1}>
          <BaseView
            row
            style={[
              layout.center,
              { backgroundColor: IS_DARK ? "#1C1C1C" : "#FFFFFF", height: 35 },
            ]}
          >
            <Pressable
              onPress={closeCommentsModal}
              hitSlop={20}
              style={{ position: "absolute", left: 20 }}
            >
              <Image
                source={Images.icons.backIcon}
                style={[
                  styles.headerBackIcon,
                  {
                    tintColor: IS_DARK ? "#FFF" : undefined,
                  },
                ]}
              />
            </Pressable>

            <BaseText>Comments</BaseText>
          </BaseView>
          <BottomSheetFlatList
            data={comments}
            keyExtractor={(_, index) => `key${index.toString()}`}
            renderItem={renderItem}
            contentContainerStyle={layout.flex_1}
            ListEmptyComponent={_ListEmptyComponent}
          />
        </BaseView>
      </BottomSheetModal>
    );
  }
);

export default Comments;

const styles = StyleSheet.create({
  renderItemStyle: {
    paddingHorizontal: 20,
    flexDirection: "row",
    marginTop: 15,
  },
  modalHandle: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  headerBackIcon: { height: 20, width: 20, borderRadius: 15 },
  backIconStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 5,
    transform: [{ rotate: "180deg" }],
  },
  avatarStyle: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    borderRadius: 15,
  },
});
