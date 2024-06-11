import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { SafeScreen } from "@/components/template";
import {
  BaseText,
  BaseView,
  Button,
  Container,
  CustomTextInput,
  SubTitleText,
} from "@/components/atoms";
import { Card } from "@/components/molecules";
import { useTheme } from "@/theme";
import Images from "@/theme/assets/images";
// Styles
import styles from "./styles";
// Controller
import usePostsController from "./PostsController";
//Helper
import PostHelper from "./helper";

import ActionSheet from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationModal from "../LocationScreen/LocationModal";
import UploadMediaGrid from "./components/UploadMediaGrid";
import { ActionSheetForImage } from "@/components/template";

const PostScreen = () => {
  const insets = useSafeAreaInsets();

  const { colors, variant, fonts, layout } = useTheme();
  const isDarkTheme = variant === "dark";

  const cardStyles = {
    backgroundColor: colors.cardBackground,
    ...styles.cardContainer,
  };

  const {
    actionSheetRef,
    actionSheetType,
    captureImage,
    captureVideo,
    comment,
    handleLocationModalVisibility,
    handleMediaIconPress,
    inputRef,
    mediaList,
    mediaCounts,
    onLocationConfirm,
    openImageLibrary,
    openVideoLibrary,
    removeSelectedMediaHandler,
    savePostHandler,
    setCommentInput,
    setStatus,
    setStatusVisibilityModal,
    showLocationModal,
    status,
    statusVisibilityModal,
    userInfo,
    userLocation,
    allProgress,
  } = usePostsController();

  const AndroidActionSheetForVideo = () => {
    return (
      <BaseView style={{ height: "100%", padding: 15 }}>
        <Text style={{ fontWeight: "600", fontSize: 18, marginBottom: 5 }}>
          Select Video
        </Text>
        <View
          style={{
            marginVertical: 10,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Pressable style={{}} hitSlop={20} onPress={captureVideo}>
            <Text style={{ fontSize: 18 }}>Take Video...</Text>
          </Pressable>
          <Pressable hitSlop={20} onPress={openVideoLibrary}>
            <Text style={{ fontSize: 18 }}>Choose from Gallery...</Text>
          </Pressable>
          <Pressable
            onPress={() => actionSheetRef?.current?.hide()}
            hitSlop={20}
          >
            <Text style={{ fontSize: 18 }}>Cancel</Text>
          </Pressable>
        </View>
      </BaseView>
    );
  };

  return (
    <>
      <SafeScreen>
        <Container style={{ paddingVertical: 10 }}>
          <Card cardStyle={cardStyles}>
            <View style={styles.userContainer}>
              <Image
                source={
                  userInfo?.displayPhoto?.value
                    ? { uri: userInfo?.displayPhoto?.value }
                    : Images.images.defaultAvatar
                }
                defaultSource={require("@/theme/assets/images/avatar.png")}
                style={{ height: 34, width: 34, borderRadius: 17 }}
              />
              <View style={{ marginLeft: 8 }}>
                <SubTitleText style={{ color: colors.topicTextColor }}>
                  {userInfo?.firstName?.value ?? ""}{" "}
                  {userInfo?.surName?.value ?? ""}
                </SubTitleText>
                <BaseText>@{userInfo?.userName?.value ?? ""}</BaseText>
              </View>
            </View>

            {/* Input Field */}
            {comment.length === 0 ? (
              <BaseText
                style={[
                  fonts.cursorColor,
                  fonts.size_14,
                  fonts.mediumFont,
                  { marginBottom: 10 },
                ]}
              >
                What's happening today?
              </BaseText>
            ) : (
              <BaseText
                style={[
                  fonts.cursorColor,
                  fonts.size_14,
                  fonts.mediumFont,
                  { marginBottom: 10, opacity: 0 },
                ]}
              >
                _
              </BaseText>
            )}
            <CustomTextInput
              multiline
              autoFocus
              ref={inputRef}
              value={comment}
              onChangeText={(t) => setCommentInput(t)}
              containerStyle={[
                styles.inputContainerStyle,
                { backgroundColor: colors.cardBackground },
              ]}
              inputStyle={[
                {
                  ...fonts.mediumFont,
                  borderBottomColor: "#FFF",
                  backgroundColor: colors.cardBackground,
                  maxHeight: 160,
                },
              ]}
              // placeholder="What's happening today?"
              placeholderTextColor={colors.cursorColor}
              underlineColorAndroid={"transparent"}
              selectionColor={colors.topicTextColor}
            />
            <BaseText
              style={[fonts.size_12, fonts.mediumFont, { marginBottom: 10 }]}
            >
              {userLocation?.address}
            </BaseText>
            {/* Status Visibility */}
            <View style={styles.statusVisibiltyWrapper}>
              <TouchableOpacity
                onPress={() => {
                  inputRef?.current?.blur();
                  setStatusVisibilityModal(!statusVisibilityModal);
                }}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 7,
                  alignItems: "center",
                }}
              >
                <Image
                  source={status.iconSource}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 15,
                    resizeMode: "contain",
                  }}
                  tintColor={isDarkTheme ? "#E4E8D7" : undefined}
                />
                <SubTitleText>{status.text}</SubTitleText>
                <Image
                  source={Images.icons.downPolygon}
                  style={{
                    width: 12,
                    height: 12,
                    marginLeft: 5,
                    resizeMode: "contain",
                  }}
                  tintColor={isDarkTheme ? "#E4E8D7" : undefined}
                />
              </TouchableOpacity>
              {statusVisibilityModal ? (
                <View
                  style={[
                    styles.statusRestrictionsWrapper,
                    { backgroundColor: isDarkTheme ? "#1C1C1C" : "#FFFFFF" },
                  ]}
                >
                  {PostHelper.StatusVisibilityMockData.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.statusRestrictionsContainer}
                        onPress={() => {
                          inputRef?.current?.blur();
                          setStatusVisibilityModal(false);
                          setStatus(item);
                        }}
                      >
                        <Image
                          source={item.iconSource}
                          style={{ width: 18, height: 18, marginRight: 15 }}
                          tintColor={isDarkTheme ? "#E4E8D7" : undefined}
                        />
                        <SubTitleText>{item?.text}</SubTitleText>
                        {index === 0 && (
                          <Image
                            source={Images.icons.downPolygon}
                            style={{ width: 12, height: 12, marginLeft: 5 }}
                            tintColor={isDarkTheme ? "#E4E8D7" : undefined}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            {/*  */}
            <View style={styles.actionButtonWrapper}>
              <View style={styles.actionButtonContainer}>
                {PostHelper.Buttons.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        inputRef?.current?.blur();

                        if ([0, 1].includes(index))
                          handleMediaIconPress(index?.toString());
                        else {
                          handleLocationModalVisibility();
                        }
                      }}
                    >
                      <Image
                        source={item.iconSource}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                        tintColor={isDarkTheme ? "#E4E8D7" : undefined}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* Post Button */}
              <Button
                onPress={savePostHandler}
                variant="gradient"
                title="Post"
                textStyle={styles.postButtonText}
                containerStyle={styles.postButtonTextContainer}
              />
            </View>
          </Card>
          <UploadMediaGrid
            allProgress={allProgress}
            mediaList={mediaList}
            removeSelectedMediaHandler={removeSelectedMediaHandler}
          />
        </Container>
      </SafeScreen>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          height: "30%",
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        }}
      >
        {actionSheetType == "0" ? (
          <ActionSheetForImage
            onCancel={() => {
              actionSheetRef?.current?.hide();
            }}
            openImageLibrary={() => openImageLibrary("photo")}
            captureImage={captureImage}
          />
        ) : (
          <AndroidActionSheetForVideo />
        )}
      </ActionSheet>
      <LocationModal
        visible={showLocationModal}
        onClose={handleLocationModalVisibility}
        onLocationConfirm={onLocationConfirm}
      />
    </>
  );
};

export default PostScreen;
