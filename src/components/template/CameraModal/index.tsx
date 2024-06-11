import * as React from "react";
import { useRef, useState, useCallback, useMemo } from "react";
import {
  AppState,
  AppStateStatus,
  GestureResponderEvent,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {
  CameraPermissionStatus,
  CameraProps,
  CameraRuntimeError,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  VideoFile,
} from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  MAX_ZOOM_FACTOR,
  SAFE_AREA_PADDING,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@/constants/Common";
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

import { StatusBarBlurBackground } from "@/components/molecules";
import { CaptureButton } from "./CaptureButton";
import { PressableOpacity } from "react-native-pressable-opacity";
// import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
// import IonIcon from "react-native-vector-icons/Ionicons";

import type { StackScreenProps } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/core";
// import { examplePlugin } from "./frame-processors/ExamplePlugin";
// import { exampleKotlinSwiftPlugin } from "./frame-processors/ExampleKotlinSwiftPlugin";
import { usePreferredCameraDevice } from "@/hooks/usePreferredCameraDevice";
import { useIsForeground } from "@/hooks/useIsForeground";
import { ApplicationStackParamList } from "@/types/navigation";
import { ROUTES } from "@/utils/routes";
import {
  CameraReverse,
  CloseIcon,
  FlashOff,
  FlashOn,
  ForwardSvgIcon,
  GalleryIcon,
  MoonFilled,
  MoonOutlined,
} from "@/theme/assets/svg";
import DocumentPicker from "react-native-document-picker";
import { useTypedDispatch, useTypedSelector } from "@/store";
import { BaseText } from "@/components/atoms";
import {
  bytesToMegabytes,
  extractBaseUrl,
  extractFilenameFromURL,
  getAssetDataFromPath,
  getFileStatsData,
  uploadMediaToS3,
} from "@/utils/fileUtils";
import { showFullScreenLoader } from "@/store/commonSlice";
import { UploadMediaFilesAPI } from "@/services/media";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { saveUserStory } from "@/services/stories";
import Video, { VideoRef } from "react-native-video";
import { FileType } from "@/screens/Post/types";
import { lowerCase, upperCase } from "lodash";

import VideoComponent from "./VideoComponents";
import { IS_ANDROID } from "@/utils/layoutUtils";
import { Strings } from "@/constants";

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;

type Props = StackScreenProps<ApplicationStackParamList, ROUTES.CAMERA_PAGE>;
export function CameraPage({ navigation }: Props): React.ReactElement {
  const dispatch = useTypedDispatch();
  const loader = useTypedSelector(
    (store) => store.CommonReducer.showFullLoader
  );
  const camera = useRef<Camera>(null);
  const appState = useRef(AppState.currentState);
  const shouldHandleBackground = useRef(true);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [assets, setAssets] = useState<any>([]);
  const [assetType, setAssetType] = useState<"photo" | "video" | undefined>(
    undefined
  );
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const hasMicrophonePermission = useMemo(
    () => Camera.getMicrophonePermissionStatus() === "granted",
    []
  );
  const zoom = useSharedValue(1);
  const isPressingButton = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [enableNightMode, setEnableNightMode] = useState(false);

  // camera device settings
  const [preferredDevice] = usePreferredCameraDevice();
  let device = useCameraDevice(cameraPosition);

  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    // override default device with the one selected by the user in settings
    device = preferredDevice;
  }

  const [targetFps, setTargetFps] = useState(60);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: "max" },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: "max" },
  ]);

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHdr;
  const supports60Fps = useMemo(
    () => device?.formats.some((f) => f.maxFps >= 60),
    [device?.formats]
  );
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  const onError = useCallback((error: CameraRuntimeError) => {}, []);
  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  const onMediaCaptured = useCallback(
    async (media: PhotoFile | VideoFile, type: "photo" | "video") => {
      let filePath = media.path;

      const stats = await getFileStatsData(decodeURIComponent(filePath));

      setAssets([stats]);
      setAssetType(type);
    },
    [navigation]
  );
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === "back" ? "front" : "back"));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus]
  );
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  useEffect(() => {
    // Reset zoom to it's default everytime the `device` changes.
    zoom.value = device?.neutralZoom ?? 1;
  }, [zoom, device]);
  //#endregion

  const _openAppSettings = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  const requestCameraPermission = async () => {
    const status = Camera.getCameraPermissionStatus();
    if (status !== "granted") {
      const newStatus = await Camera.requestCameraPermission();

      setCameraPermissionStatus(newStatus);
    } else {
      setCameraPermissionStatus(status);
    }
  };
  const requesMicrophonePermission = async () => {
    const status = Camera.getMicrophonePermissionStatus();

    if (status !== "granted") {
      const newStatus = await Camera.requestMicrophonePermission();

      setMicrophonePermissionStatus(newStatus);
    } else {
      setMicrophonePermissionStatus(status);
    }
  };

  // useEffect(() => {
  //   if (isFocussed) {
  //
  //     requestCameraPermission();
  //     requesMicrophonePermission();
  //   }
  // }, [navigation, isFocussed]);

  useEffect(() => {
    requestCameraPermission();
    requesMicrophonePermission();
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === appState.current) return;
        const isTransitioningToForeground =
          appState.current.match(/inactive|background/) &&
          nextAppState === "active";
        if (
          shouldHandleBackground.current &&
          isTransitioningToForeground &&
          (cameraPermissionStatus !== "granted" ||
            microphonePermissionStatus !== "granted")
        ) {
          shouldHandleBackground.current = false;
          await requestCameraPermission();
          await requesMicrophonePermission();
          shouldHandleBackground.current = true;
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP
      );
    },
  });
  //#endregion

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined;
  }, [device?.name, format, fps]);

  const onClosePressed = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onGalleryIconPress = useCallback(async () => {
    try {
      const documents = await DocumentPicker.pickSingle({
        presentationStyle: "pageSheet",
        type: ["video/mp4", "image/jpeg"],
        copyTo: "documentDirectory",
        transitionStyle: "crossDissolve",
      });

      if (documents?.fileCopyUri) {
        const stats = await getFileStatsData(
          decodeURIComponent(documents?.fileCopyUri)
        );

        setAssets([stats]);
      }

      if (documents.type && documents.type?.startsWith("image")) {
        setAssetType("photo");
      } else if (documents.type && documents.type?.startsWith("video")) {
        setAssetType("video");
      }
      // await uploadHandler({
      //   path: documents?.uri,
      //   size: documents?.size || stats.size || 0,
      // });
    } catch (error) {
      setAssetType(undefined);
      setAssets([]);
    }
  }, [navigation]);

  const uploadMediaAsset = async ({
    url,
    fileType,
    duration,
  }: {
    url: string;
    fileType: string;
    duration: number;
  }) => {
    return await saveUserStory({
      urlsAndFileType: [{ url, fileType }],
      fileType: upperCase(fileType),
      duration,
    });
  };

  const filenameWithExtension = (url: string) => extractFilenameFromURL(url);

  const getURL = (url: string) =>
    url && filenameWithExtension(url)
      ? Strings.CDN_URL.concat(filenameWithExtension(url) || "")
      : url;

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
          const response = await uploadMediaToS3(
            media.url,
            path,
            (sent, total) => {
              const progress = Math.round((sent * 100) / total);

              if (progress % 10 === 0 || progress === 100) {
                // setAllProgress((prevProgress) => ({
                //   ...prevProgress,
                //   [fileName]: progress,
                // }));
              }
            }
          );

          if (response && mediaRemoteUri) {
            const uploadResult = await uploadMediaAsset({
              url: mediaRemoteUri,
              fileType:
                assetType === "photo"
                  ? lowerCase(FileType.IMAGE)
                  : assetType === "video"
                  ? lowerCase(FileType.VIDEO)
                  : lowerCase(FileType.NONE),
              duration:
                assetType === "photo" ? 5 : assetType === "video" ? 30 : 0,
            });
            if (uploadResult.code === 201) {
              showSuccessToast(uploadResult.message || "Uploaded successfully");
              setAssets([]);
              setAssetType(undefined);
              let timer = setTimeout(() => {
                dispatch(showFullScreenLoader(false));
                if (timer) clearTimeout(timer);
                onClosePressed();
              }, 400);
            }
          }
        });
      }
    } catch (error) {
      setAssets([]);
      setAssetType(undefined);
      dispatch(showFullScreenLoader(false));

      showErrorToast("Something went wrong.");
    } finally {
    }
  };

  if (
    cameraPermissionStatus !== "granted" ||
    microphonePermissionStatus !== "granted"
  ) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          },
        ]}
      >
        <BaseText style={{ color: "white", textAlign: "center", fontSize: 20 }}>
          Allow Treefe to access your camera and microphone
        </BaseText>
        <BaseText
          style={{ color: "white", textAlign: "center", marginTop: 10 }}
        >
          This lets you share photos, record videos and preview them. You can
          change this anytime in your device settings.
        </BaseText>
        <PressableOpacity onPress={_openAppSettings} style={{ marginTop: 20 }}>
          <BaseText style={{ color: "blue", textAlign: "center" }}>
            Open Settings
          </BaseText>
        </PressableOpacity>
        <View style={{ position: "absolute", top: 30, left: 10 }}>
          <PressableOpacity
            style={styles.button}
            onPress={onClosePressed}
            disabledOpacity={0.4}
          >
            <CloseIcon height={24} width={24} />
          </PressableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {assets?.length > 0 ? (
        <>
          {assetType === "photo" ? (
            <Image
              source={{ uri: `file://${assets?.[0]?.path}` }}
              style={{ height: "100%", width: "100%" }}
              onError={(e) => {}}
            />
          ) : assetType === "video" ? (
            <VideoComponent
              path={
                IS_ANDROID ? `file://${assets?.[0]?.path}` : assets?.[0]?.path
              }
            />
          ) : (
            <></>
          )}
          <View style={StyleSheet.absoluteFill}>
            <View
              style={{
                position: "absolute",
                bottom: SAFE_AREA_PADDING.paddingBottom,
                right: 30,
              }}
            >
              <PressableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "#709C3C",
                  },
                ]}
                onPress={async () => {
                  await uploadHandler({
                    size: assets?.[0]?.size,
                    path: assets?.[0]?.path,
                  });
                }}
                disabledOpacity={0.4}
              >
                <ForwardSvgIcon height={24} width={24} />
              </PressableOpacity>
            </View>
            <View style={{ position: "absolute", top: 30, left: 10 }}>
              <PressableOpacity
                style={styles.button}
                onPress={() => {
                  setAssets([]);
                }}
                disabledOpacity={0.4}
              >
                <CloseIcon height={24} width={24} />
              </PressableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          {device != null && (
            <PinchGestureHandler
              onGestureEvent={onPinchGesture}
              enabled={isActive}
            >
              <Reanimated.View
                onTouchEnd={onFocusTap}
                style={StyleSheet.absoluteFill}
              >
                <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
                  <ReanimatedCamera
                    style={
                      isCameraInitialized
                        ? {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }
                        : {
                            width: 0,
                            height: 0,
                          }
                    }
                    device={device}
                    isActive={isActive}
                    ref={camera}
                    onInitialized={() => {
                      setIsCameraInitialized(true);
                    }}
                    onError={onError}
                    onStarted={() => "Camera started!"}
                    onStopped={() => "Camera stopped!"}
                    format={format}
                    fps={fps}
                    photoHdr={format?.supportsPhotoHdr && enableHdr}
                    videoHdr={format?.supportsVideoHdr && enableHdr}
                    lowLightBoost={
                      device.supportsLowLightBoost && enableNightMode
                    }
                    enableZoomGesture={false}
                    animatedProps={cameraAnimatedProps}
                    exposure={0}
                    enableFpsGraph={true}
                    orientation="portrait"
                    photo={true}
                    video={true}
                    audio={hasMicrophonePermission}

                    // frameProcessor={frameProcessor}
                  />
                </TapGestureHandler>
              </Reanimated.View>
            </PinchGestureHandler>
          )}

          <CaptureButton
            style={styles.captureButton}
            camera={camera}
            onMediaCaptured={onMediaCaptured}
            cameraZoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            flash={supportsFlash ? flash : "off"}
            enabled={isCameraInitialized && isActive}
            setIsPressingButton={setIsPressingButton}
          />

          <StatusBarBlurBackground />

          <View style={{ position: "absolute", top: 30, left: 10 }}>
            <PressableOpacity
              style={styles.button}
              onPress={onClosePressed}
              disabledOpacity={0.4}
            >
              <CloseIcon height={24} width={24} />
            </PressableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: SAFE_AREA_PADDING.paddingBottom,
              left: 10,
            }}
          >
            <PressableOpacity
              style={styles.button}
              onPress={onGalleryIconPress}
              disabledOpacity={0.4}
            >
              <GalleryIcon height={24} width={24} />
            </PressableOpacity>
          </View>
          <View style={styles.rightButtonRow}>
            <PressableOpacity
              style={styles.button}
              onPress={onFlipCameraPressed}
              disabledOpacity={0.4}
            >
              <CameraReverse height={24} width={24} />
            </PressableOpacity>
            {supportsFlash && (
              <PressableOpacity
                style={styles.button}
                onPress={onFlashPressed}
                disabledOpacity={0.4}
              >
                {flash === "on" ? (
                  <FlashOn height={24} width={24} />
                ) : (
                  <FlashOff height={24} width={24} />
                )}
              </PressableOpacity>
            )}
            {supports60Fps && (
              <PressableOpacity
                style={styles.button}
                onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}
              >
                <Text style={styles.text}>{`${targetFps}\nFPS`}</Text>
              </PressableOpacity>
            )}
            {supportsHdr && (
              <PressableOpacity
                style={styles.button}
                onPress={() => setEnableHdr((h) => !h)}
              >
                {/* <MaterialIcon
              name={enableHdr ? "hdr" : "hdr-off"}
              color="white"
              size={24}
            /> */}
              </PressableOpacity>
            )}
            {canToggleNightMode && (
              <PressableOpacity
                style={styles.button}
                onPress={() => setEnableNightMode(!enableNightMode)}
                disabledOpacity={0.4}
              >
                {enableNightMode ? (
                  <MoonFilled height={24} width={24} />
                ) : (
                  <MoonOutlined height={24} width={24} />
                )}
              </PressableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  captureButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: "rgba(140, 140, 140, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  rightButtonRow: {
    position: "absolute",
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
});
