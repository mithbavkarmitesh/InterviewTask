import { BaseText, Button } from "@/components/atoms";
import SubtitleText from "@/components/atoms/Typography/SubTitleText";
import { Card } from "@/components/molecules";
import Images from "@/theme/assets/images";
import {
  IS_ANDROID,
  IS_IOS,
  getWindowHeight,
  getWindowWidth,
  hp,
  wp,
} from "@/utils/layoutUtils";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  ViewToken,
} from "react-native";
import { MasonryListMock } from "../../mocks/masonryList";
import UserStories from "../../mocks/stories";
import Comments from "@/screens/Comments";

import useFeedController from "./FeedController";
import { getTimeAgo } from "@/utils/dateutils";
import Swiper from "react-native-swiper";
import { useTheme } from "@/theme";
import { Posts } from "../../types";
import { FileType } from "@/screens/Post/types";
import ImageCarouselPost from "../RenderPosts/ImageCarouselPost";
import PostCardWithText from "../RenderPosts/PostCardWithText";
import VideoPost from "../RenderPosts/VideoPost";
import { useIsFocused } from "@react-navigation/native";
import UserStoryAvatar from "../UserStoryAvatar";
import {
  MultiStoryContainer,
  MultiStory,
  TransitionMode,
  Indicator,
} from "react-native-story-view";
import { Footer, Header } from "@/components/template/StoryView/components";
import RootNavigation from "@/navigators/helper";
import AddUserStory from "../UserStoryAvatar/AddUserStory";

const Feed = (props) => {
  const { colors, variant, backgrounds } = useTheme();
  const isDarkTheme = variant === "dark";

  const safeViewBackgroundColor = {
    backgroundColor: isDarkTheme ? "#1C1C1C" : "#FFFFFF",
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100,
    // itemVisiblePercentThreshold: 70,
    minimumViewTime: 400,
  };

  const {
    /* postsQuery, postsList, */
    dataSource,
    openStories,
    isStoryViewVisible,
    getData,
    loading,
    refreshing,
    refreshData,
    currentUser,
    setCurrentIndex,
    currentIndex,
    loadMorePosts,
    multiStoryRef,
    userStories,
    pressedIndex,
    onStoryClose,
    setIsUploadMediaVisible,
    isUploadMediaVisible,
    closeStoryView,
    viewedStories,
    storyHeartOrUnheart,
  } = useFeedController();

  const isFocused = useIsFocused();

  const Is_ForYouPage = props?.index === 0;

  const _ItemSeparatorComponent = () => {
    return <View style={{ width: wp(8) }} />;
  };
  const _ItemSeparatorComponent2 = () => {
    return <View style={{ height: wp(10) }} />;
  };

  const renderItem = ({
    item,
    index,
    separators,
  }: ListRenderItemInfo<(typeof UserStories)[0]>) => {
    return (
      <UserStoryAvatar
        item={item}
        index={index}
        onPress={() => {
          openStories(index);
        }}
      />
    );
  };
  const emptyRenderItem = ({
    item,
    index,
    separators,
  }: ListRenderItemInfo<any>) => {
    return (
      <AddUserStory
        item={item}
        index={index}
        onPress={() => {
          openStories(index);
        }}
      />
    );
  };

  const _renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    // console.log("item ===", item);
    if (item?.fileType === FileType.NONE)
      return <PostCardWithText item={item} />;

    if (item?.fileType === FileType.VIDEO) {
      return (
        <VideoPost
          item={item}
          isVideoVisible={Is_ForYouPage && currentIndex === index && isFocused}
        />
      );
    }
    if (item?.fileType === FileType.IMAGE)
      return <ImageCarouselPost item={item} />;
    return null;
  };

  /**
   * Called any time a new post is shown when a user scrolls
   * the FlatList, when this happens we should start playing
   * the post that is viewable and stop all the others
   */
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0]) {
      if (
        viewableItems[0].isViewable &&
        viewableItems[0].index !== null &&
        viewableItems[0].index > -1
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const renderFooter = () => {
    return (
      //Footer View with Loader
      <View
        style={{
          // padding: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.green} style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };
  const renderHeader = () => {
    if (userStories?.length > 0)
      return (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={userStories}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString()}
          contentContainerStyle={{
            paddingVertical: hp(8),
            paddingLeft: wp(20),
            marginBottom: hp(8),
          }}
          ItemSeparatorComponent={_ItemSeparatorComponent}
        />
      );
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1]}
        renderItem={emptyRenderItem}
        keyExtractor={(_, index) => index?.toString()}
        contentContainerStyle={{
          paddingVertical: hp(8),
          paddingLeft: wp(20),
          marginBottom: hp(8),
        }}
        ItemSeparatorComponent={_ItemSeparatorComponent}
      />
    );
  };

  return (
    <ImageBackground
      imageStyle={{
        width: "100%",
        height: "100%",
        opacity: 0.1,
      }}
      source={Images.images.mainBackground}
      resizeMode="cover"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataSource}
        renderItem={_renderItem}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={_ItemSeparatorComponent2}
        removeClippedSubviews
        initialNumToRender={2}
        onEndReachedThreshold={0.2}
        onEndReached={dataSource?.length > 0 ? loadMorePosts : null}
        // decelerationRate={"fast"}
        // snapToInterval={Dimensions.get("window").height}
        // snapToAlignment={"start"}
        initialScrollIndex={0}
        disableIntervalMomentum
        // onScroll={handleScroll}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
        contentContainerStyle={{
          paddingVertical: hp(10),
          paddingTop: hp(5),
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
      {isStoryViewVisible && (
        <MultiStoryContainer
          visible={isStoryViewVisible}
          onComplete={onStoryClose}
          stories={userStories}
          transitionMode={TransitionMode.Cube}
          renderHeaderComponent={({ userStories }) => (
            <Header
              {...{ userStories, multiStoryRef }}
              closeStoryView={closeStoryView}
            />
          )}
          renderFooterComponent={({ userStories, story, progressIndex }) => (
            <Footer
              {...{ userStories, story, progressIndex, storyHeartOrUnheart }}
            />
          )}
          userStoryIndex={pressedIndex}
          barStyle={{
            barActiveColor: isDarkTheme ? "#E4E8D7" : "#709C3C",
            barInActiveColor: isDarkTheme ? "#2C2C2C" : "#FFFFFF",
          }}
          storyContainerRootStyle={backgrounds.primaryBackground}
          viewedStories={viewedStories.current}
          onChangePosition={(progressIndex, storyIndex) => {}}
          videoProps={{
            bufferConfig: {
              // minBufferMs: 15000,
              // maxBufferMs: 50000,
              // // // bufferForPlaybackMs: 15000,
              // bufferForPlaybackAfterRebufferMs: 15000,
              // // // backBufferDurationMs: 120000,
              // maxHeapAllocationPercent: 0.8,
              minBufferMs: 2500,
              maxBufferMs: 5000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 2500,
            },
          }}
          sourceIndicatorProps={{ color: "#709C3C" }}
        />
      )}
    </ImageBackground>
  );
};

export default Feed;
