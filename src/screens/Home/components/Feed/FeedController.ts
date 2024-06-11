import { View, Text, BackHandler } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserPosts, heartOrUnHeart } from "@/services/posts";
import { useTypedDispatch, useTypedSelector } from "@/store";
import { useIsFocused } from "@react-navigation/native";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { StoriesType, type MultiStoryRef } from "react-native-story-view";
import UserStories from "../../mocks/stories";
import useBackHandler from "@/hooks/useBackHandler";
import {
  getFriendsStories,
  getLoggedInUserStories,
  heartOrUnheartStory,
} from "@/services/stories";
import { cloneDeep } from "lodash";
import { showFullScreenLoader } from "@/store/commonSlice";

const useFeedController = () => {
  const isFocused = useIsFocused();
  const currentUser = useTypedSelector((state) => state.UserReducer.userInfo);
  const dispatch = useTypedDispatch();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefresing] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [offset, setOffset] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const [isUploadMediaVisible, setIsUploadMediaVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);

  const multiStoryRef = useRef<MultiStoryRef>(null);

  const openStories = (index: number) => {
    setIsStoryViewShow(true);
    setPressedIndex(index);
  };

  const [userStories, setUserStories] = useState<StoriesType[]>(
    []
    // JSON.parse(JSON.stringify(UserStories))
  );

  const viewedStories = useRef<Array<boolean[]>>([]);

  const onStoryClose = (viewedStories?: Array<boolean[]>) => {
    // if (viewedStories == null || viewedStories == undefined) return;
    // const stories = [...userStories];
    // userStories.map((_: any, index: number) => {
    //   userStories[index].stories.map((_: any, subIndex: number) => {
    //     stories[index].stories[subIndex].isSeen =
    //       viewedStories[index][subIndex];
    //   });
    // });
    // setUserStories([...stories]);
    setIsStoryViewShow(false);
  };

  const loadMorePosts = async () => {
    getData();
  };

  const getData = () => {
    if (!loading && !isListEnd) {
      // setLoading(true);
      //Service to get the data from the server to render
      getUserPosts(offset)
        .then((response) => {
          if (response.data.length > 0) {
            setOffset(offset + 1);
            setDataSource([...dataSource, ...response.data]);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        })
        .catch((error: any) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const refreshData = async () => {
    const [userStoryResponse] = await Promise.all([
      getCurrentLoggedUserStories(),
    ]);
    if (!loading && !isListEnd) {
      setCurrentIndex(0);

      setLoading(true);
      setRefresing(true);
      setOffset(0);
      //Service to get the data from the server to render
      const [userPostsResponse] = await Promise.all([getUserPosts()]).finally(
        () => {
          setLoading(false);
          setRefresing(false);
        }
      );

      if (userPostsResponse.data.length > 0) {
        setOffset(offset + 1);
        setDataSource([...dataSource, ...userPostsResponse.data]);
      } else {
        setIsListEnd(true);
      }
    }
  };

  const getCurrentLoggedUserStories = async () => {
    try {
      const response = await getLoggedInUserStories();
      if (
        response?.data &&
        response.data[0]?.id &&
        response.data[0]?.stories?.length > 0
      ) {
        const isNewStory =
          userStories.length === 0 || userStories[0].id !== response.data[0].id;

        setUserStories((prevUserStories) =>
          isNewStory
            ? [cloneDeep(response.data[0]), ...prevUserStories]
            : [cloneDeep(response.data[0])]
        );

        await getCurrentLoggedUserFriendsStories();
      }
    } catch (error) {}
  };

  const getCurrentLoggedUserFriendsStories = async () => {
    try {
      const response = await getFriendsStories();
      if (
        response?.data &&
        Array.isArray(response.data) &&
        response.data.length
      ) {
        setUserStories((prevUserStories) => {
          const friendStoriesIds = new Set(
            prevUserStories.map((user) => user.id)
          );
          const newFriendStories = response.data.filter(
            (friend) => !friendStoriesIds.has(friend.id)
          );
          return [...prevUserStories, ...newFriendStories];
        });
      }
    } catch (error) {}
  };

  const storyHeartOrUnheart = async (storyId: string, successCallback: any) => {
    try {
      const response = await heartOrUnheartStory(storyId);
      successCallback(response?.flag);
    } catch (error) {}
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(showFullScreenLoader(false));
      getData();
      getCurrentLoggedUserStories();
      getCurrentLoggedUserFriendsStories();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userStories?.length) {
      viewedStories.current = userStories.map((userStory) =>
        userStory?.stories?.map((story) => story.isSeen ?? false)
      );
    }
  }, [userStories]);

  const handler = () => {
    setIsStoryViewShow(false);

    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handler);

    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, []);

  const closeStoryView = useCallback(() => {
    setIsStoryViewShow(false);
  }, [setIsStoryViewShow]);

  return {
    getData,
    loading,
    setCurrentIndex,
    currentIndex,
    refreshData,
    refreshing,
    dataSource,
    currentUser,
    loadMorePosts,
    isStoryViewVisible,
    openStories,
    multiStoryRef,
    userStories,
    pressedIndex,
    onStoryClose,
    setIsUploadMediaVisible,
    isUploadMediaVisible,
    closeStoryView,
    viewedStories,
    storyHeartOrUnheart,
  };
};

export default useFeedController;
