import { useEffect, useRef, useState } from "react";
import PostHelper from "./helper";
import { ActionSheetRef } from "react-native-actions-sheet";
import {
  ActionSheetIOS,
  Alert,
  Keyboard,
  NativeEventEmitter,
  NativeModules,
  TextInput,
} from "react-native";
import {
  IS_ANDROID,
  IS_IOS,
  getWindowHeight,
  getWindowWidth,
} from "@/utils/layoutUtils";
import ImageCropPicker, { Image, Video } from "react-native-image-crop-picker";
import { saveUserPost } from "@/services/posts";
import { useTypedDispatch, useTypedSelector } from "@/store";
import { showFullScreenLoader } from "@/store/commonSlice";
import { CameraActions, FileType, MediaList } from "./types";
import { DeleteMediaFileAPI, UploadMediaFilesAPI } from "@/services/media";
import {
  bytesToMegabytes,
  extractBaseUrl,
  extractFilenameFromURL,
  getAssetDataFromPath,
  getFileStatsData,
  uploadMediaToS3,
} from "@/utils/fileUtils";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { useIsFocused } from "@react-navigation/native";
import { isValidVideo, showEditor } from "react-native-video-trim";
import { useSharedValue } from "react-native-reanimated";
import RootNavigation from "@/navigators/helper";
import { ROUTES } from "@/utils/routes";
import useDoubleBackPressExit from "@/hooks/useBackHandlerForExit";

const usePostsController = () => {
  useDoubleBackPressExit();
  const [comment, setCommentInput] = useState("");
  const [statusVisibilityModal, setStatusVisibilityModal] = useState(false);
  const [status, setStatus] = useState(PostHelper.StatusVisibilityMockData[0]);
  const [actionSheetType, setActionSheetType] = useState("0");
  const [mediaList, setMediaList] = useState<Array<MediaList>>([]);
  const [videoList, setVideoList] = useState<Video | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
  });
  const [mediaCounts, setMediaCounts] = useState({
    image: 0,
    video: 0,
    unknown: 0,
  });
  const [allProgress, setAllProgress] = useState({});
  const videoFilePath = useSharedValue<null | string>(null);
  const userInfo = useTypedSelector((store) => store.UserReducer.userInfo);
  // Refs
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const inputRef = useRef<TextInput>(null);

  //Dispatch
  const dispatch = useTypedDispatch();

  const isFocused = useIsFocused();

  const onMediaIconPressIOS = (type: "0" | "1") =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          type === "0" ? CameraActions.Photo : CameraActions.Video,
          CameraActions.Gallery,
          CameraActions.Cancel,
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 2,
        title: type === "0" ? "Select Image" : "Select Video",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          type === "0" ? captureImage() : captureVideo();
        } else if (buttonIndex === 1) {
          type === "0" ? openImageLibrary("photo") : openVideoLibrary();
        } else if (buttonIndex === 2) {
        }
      }
    );

  const handleMediaIconPress = (type: "0" | "1") => {
    // Do not allow images if video is already present
    if (type == "0" && mediaCounts.video > 0) {
      Alert.alert("Only images or video is allowed at a time.");
      return;
    }
    // Do not allow videos if image is already present
    if (type == "1" && mediaCounts.image > 0) {
      Alert.alert("Only images or video is allowed at a time.");
      return;
    }
    if (type == "1" && mediaCounts.video === 1) {
      Alert.alert("Only one video is allowed at a time.");
      return;
    }
    setActionSheetType(type);
    if (IS_IOS) {
      onMediaIconPressIOS(type);
    } else {
      actionSheetRef?.current?.show();
    }
  };

  const captureImage = async () => {
    if (mediaList?.length < 7)
      ImageCropPicker.openCamera({
        width: Math.floor(0.875 * getWindowWidth()),
        height: Math.floor(0.475 * getWindowHeight()),
        cropping: true,
        mediaType: "photo",
      })
        .then(async (image) => {
          setMediaList((media) => [...media, image]);
          await uploadHandler({ path: image.path, size: image.size });
        })
        .catch((error) => {})
        .finally(() => {
          if (IS_ANDROID) actionSheetRef?.current?.hide();
        });
  };

  const captureVideo = async () => {
    if (mediaList?.length < 7)
      ImageCropPicker.openCamera({
        mediaType: "video",
      })
        .then(async (video) => {
          setVideoList(video);
        })
        .catch((error) => {})
        .finally(() => {
          if (IS_ANDROID) actionSheetRef?.current?.hide();
        });
  };

  const openVideoLibrary = async () => {
    const videoFile = await ImageCropPicker.openPicker({
      mediaType: "video",
      multiple: false,
      compressVideoPreset: "MediumQuality",
    })
      .then(async (video) => {
        setVideoList(video);
      })
      .catch((err) => {});
  };

  const openImageLibrary = async (mediaType: "photo") => {
    ImageCropPicker.openPicker({
      cropping: true,
      maxFiles: 6,
      multiple: true,
      mediaType: "photo",
    })
      .then(async (images) => {
        if (images.length > 6) {
          Alert.alert("Upto 6 images can be selected");
        }
        const imagesList = images?.slice(0, Math.abs(6 - mediaList?.length));
        const result: Image[] = [];
        for (const image of imagesList) {
          result.push(
            await ImageCropPicker.openCropper({
              path: image.path,
              width: Math.floor(0.875 * getWindowWidth()),
              height: Math.floor(0.475 * getWindowHeight()),
              mediaType: "photo",
            })
          );
        }
        // Add all media to state
        setMediaList((prevMediaList) => [...prevMediaList, ...result]);

        result?.forEach(
          async (image) =>
            await uploadHandler({ path: image.path, size: image.size })
        );
      })
      .catch((error) => {})
      .finally(() => {
        if (IS_ANDROID) actionSheetRef?.current?.hide();
      });
  };

  const handleLocationModalVisibility = () => {
    setShowLocationModal(!showLocationModal);
  };
  /**
   *
   * @param index
   * @param uri urlToRemove
   */
  const removeSelectedMediaHandler = async (index: number, uri: string) => {
    if (index >= 0 && uri && uri.length > 0) {
      try {
        dispatch(showFullScreenLoader(true));
        const url = new URL(uri).pathname?.slice(1);
        const response = await DeleteMediaFileAPI(url);
        if (response.code === 200) {
          showSuccessToast(response.message || "");

          const filteredMediaList = mediaList
            ? mediaList.filter((media) => media?.remoteUri !== uri)
            : [];
          setMediaList(filteredMediaList);
        }
      } catch (error) {
        showErrorToast(error?.message || "Error in removing media file");
      } finally {
        showSuccessToast("Removed file successfully");
        dispatch(showFullScreenLoader(false));
      }
    }
  };

  const uploadHandler = async ({
    path,
    size,
  }: {
    path: string;
    size: number;
  }) => {
    try {
      dispatch(showFullScreenLoader(true));
      const { fileName, extension } = getAssetDataFromPath(path);
      const mediaFile = [
        {
          fileSize: bytesToMegabytes(size),
          fileName,
          extension,
        },
      ];
      const response = await UploadMediaFilesAPI(mediaFile);
      // https://d2dxww5z1njjdt.cloudfront.net/
      if (response && Array.isArray(response)) {
        response.forEach(async (media) => {
          const mediaRemoteUri = extractBaseUrl(media.url);
          try {
            const response = await uploadMediaToS3(
              media.url,
              path,
              (sent, total) => {
                const progress = Math.round((sent * 100) / total);

                if (progress % 10 === 0 || progress === 100) {
                  setAllProgress((prevProgress) => ({
                    ...prevProgress,
                    [fileName]: progress,
                  }));
                }
              }
            );

            if (response && mediaRemoteUri) {
              dispatch(showFullScreenLoader(false));
              setMediaList((prevMedia) => {
                return prevMedia.map((element) => {
                  if (path === element?.path) {
                    return { ...element, remoteUri: mediaRemoteUri };
                  }
                  return element;
                });
              });
              // Setting progress to 100 even though upload might not be complete.
              // This is because the remote URI was received, but progress updates
              // might not have reached 100% yet.
              setAllProgress((prevProgress) => ({
                ...prevProgress,
                [fileName]: 100,
              }));
            }
          } catch (error) {
            dispatch(showFullScreenLoader(false));

            setAllProgress((prevProgress) => ({
              ...prevProgress,
              [fileName]: 0,
            }));
            throw error;
          } finally {
            showSuccessToast("Uploaded successfully");
            dispatch(showFullScreenLoader(false));
          }
        });
      }
    } catch (error) {
    } finally {
    }
  };

  const generatePayload = () => {
    const payload: {
      restrictions?: string; // Replace with the actual type of status.id
      postText?: string; // Replace with the actual type of comment
      urlsAndFileType?: {
        url: string;
        fileType: string;
      }[]; // Replace with the actual type of mediaList[i].remoteUri
      latitude?: string; // Replace with the actual type of userLocation.latitude
      longitude?: string; // Replace with the actual type of userLocation.longitude
      address?: string; // Replace with the actual type of userLocation.address
      fileType?: string;
    } = {};

    if (status) payload["restrictions"] = status.type;
    if (comment) payload["postText"] = comment;

    if (userLocation.latitude && userLocation.longitude) {
      payload["latitude"] = userLocation.latitude?.toString();
      payload["longitude"] = userLocation.longitude?.toString();
    }
    if (userLocation.address) {
      payload["address"] = userLocation.address;
    }
    // Assuming that, at one point, only image or video will be present in the payload
    if (mediaCounts.image > 0) {
      const urls = mediaList
        .map((media) => ({
          url: media?.remoteUri as string,
          fileType: "Image",
        }))
        .filter((url): url is string => url !== undefined);
      payload["fileType"] = FileType.IMAGE;
      payload["urlsAndFileType"] = urls;
    } else {
      const urls = mediaList
        .map((media) => ({
          url: media?.remoteUri as string,
          fileType: "Video",
        }))
        .filter((url): url is string => url !== undefined);
      payload["fileType"] =
        mediaCounts.video > 0 ? FileType.VIDEO : FileType.NONE;
      if (mediaCounts.video > 0) payload["urlsAndFileType"] = urls;
    }
    return payload;
  };

  const validatePayload = () => {
    if (comment.length > 0) {
      return true;
    }
    if (mediaCounts?.image > 0 || mediaCounts?.video > 0) {
      return true;
    }
    return false;
  };
  const savePostHandler = async () => {
    try {
      Keyboard?.dismiss();
      if (!validatePayload()) {
        showErrorToast(`Please add a valid post.`);
        return;
      }
      dispatch(showFullScreenLoader(true));
      const payload = generatePayload();
      const response = await saveUserPost(payload);
      if (response.flag) {
        showSuccessToast(response.message);
        setMediaList([]);
        setCommentInput("");
        setAllProgress({});
        setStatus(PostHelper.StatusVisibilityMockData[0]);
        setVideoList(null);
        setMediaCounts({ image: 0, video: 0, unknown: 0 });
        setUserLocation({ latitude: 0, longitude: 0, address: "" });
        videoFilePath.value = null;
        RootNavigation.reset(ROUTES.HOME);
      }
    } catch (error) {
    } finally {
      dispatch(showFullScreenLoader(false));
    }
  };

  const handleEditedVideo = async (path: string) => {
    try {
      const fileStat = await getFileStatsData(path);
      if (fileStat.path && videoList?.size) {
        const mediaFile = {
          ...videoList,
          path: fileStat.path,
          size: fileStat.size,
          filename: fileStat.filename,
        };
        setMediaList([mediaFile]);
        setVideoList(null);
        // reset file path
        videoFilePath.value = null;
        [mediaFile]?.forEach(
          async (video) =>
            await uploadHandler({ path: video.path, size: video.size })
        );
      }
    } catch (error) {
    } finally {
      if (IS_ANDROID) actionSheetRef?.current?.hide();
    }
  };
  const showVideoEditor = async (video: Video) => {
    const fileStat = await getFileStatsData(video.path);
    const res = IS_IOS
      ? video?.sourceURL && (await isValidVideo(video?.sourceURL))
      : IS_ANDROID
      ? video?.path && (await isValidVideo(video.path))
      : false;

    if (!res) {
      showErrorToast(
        "Something went wrong in selecting video. Please try again later"
      );
      return undefined;
    }
    await showEditor(fileStat.path, {
      maxDuration: 30,
      saveButtonText: "Continue",
      saveToPhoto: false,
    });
  };

  useEffect(() => {
    if (inputRef?.current) {
      // Keyboard gets in focus
      inputRef?.current?.focus();
    }
    /**
     * Video Editor feature
     */
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener("VideoTrim", (event) => {
      switch (event.name) {
        case "onShow": {
          break;
        }
        case "onHide": {
          break;
        }
        case "onStartTrimming": {
          break;
        }
        case "onFinishTrimming": {
          // Assuming there is no images & only one video
          if (!event.outputPath) break;
          videoFilePath.value = event.outputPath;

          break;
        }
        case "onCancelTrimming": {
          break;
        }
        case "onError": {
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (videoFilePath.value && videoFilePath.value.length > 0) {
      handleEditedVideo(videoFilePath.value);
    }
  }, [videoFilePath.value]);
  useEffect(() => {
    if (mediaList) {
      const mediaCounts = PostHelper.countMediaTypes(mediaList);
      setMediaCounts(mediaCounts);
    }
  }, [mediaList]);

  useEffect(() => {
    if (isFocused) {
      setAllProgress({});
    }
  }, [isFocused]);

  useEffect(() => {
    if (videoList) {
      showVideoEditor(videoList);
    }
  }, [videoList]);

  const onLocationConfirm = ({ latitude, longitude, address }: any) => {
    setUserLocation({ latitude, longitude, address });
    setShowLocationModal(false);
  };

  return {
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
    userLocation,
    userInfo,
    allProgress,
  };
};

export default usePostsController;
