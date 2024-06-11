import React, { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { ROUTES } from "@/utils/routes";
import { FullScreenLoader } from "@/components/template";
import HomeTabsNavigator from "./Tabs";
import {
  Example,
  Startup,
  LoginScreen,
  OTPScreen,
  Onboarding,
  Registration,
  TopicSelection,
  PhoneNumberInputScreen,
} from "@/screens";
import { useTheme } from "@/theme";
import { navigationRef } from "./helper";
import {
  setUserImages,
  setUserInfo,
  setUserPosts,
  setUserVideos,
} from "@/store/userSlice";
import {
  getCompleteUserInfo,
  getUserAllImages,
  getUserAllPosts,
  getUserAllVideos,
} from "@/services/users";
import { useTypedSelector } from "@/store";
import { CameraPage } from "@/components/template/CameraModal";

const Stack = createStackNavigator();

function ApplicationNavigator() {
  const dispatch = useDispatch();
  const { accessToken } = useTypedSelector((store) => store.UserReducer);
  const { isUserFirstInstall, showFullLoader, isManuallyThemeEnabled } =
    useTypedSelector((store) => store.CommonReducer);
  const appearance = useColorScheme();
  const { variant, navigationTheme, changeTheme } = useTheme();

  useEffect(() => {
    if (accessToken && accessToken?.length > 0) {
      async function fetchData() {
        try {
          const [userInfo, posts, images, videos] = await Promise.all([
            getCompleteUserInfo(),
            getUserAllPosts(0),
            getUserAllImages(),
            getUserAllVideos(),
          ]);
          dispatch(setUserInfo(userInfo.data));
          dispatch(setUserPosts(posts.data));
          dispatch(setUserImages(images.data));
          dispatch(setUserVideos(videos.data));
        } catch (error) {}
      }
      fetchData();
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (isManuallyThemeEnabled === null) {
      if (appearance === "light") {
        changeTheme("default");
      } else if (appearance === "dark") {
        changeTheme("dark");
      }
    }
  }, [appearance, isManuallyThemeEnabled]);

  useEffect(() => {
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // navigateToPage(remoteMessage.data);
          if (remoteMessage) {
            const notificationData =
              remoteMessage?.data?.data &&
              JSON.parse(remoteMessage?.data?.data);

            // updateSeenStatusApi(notificationData.id); //ToDo Check id
            // handleNotificationNavigation(notificationData);
          }
          // PushNotification.clearAllNotifications();
        }
      });
  }, []);

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <StatusBar backgroundColor={variant === "dark" ? "#1C1C1C" : "#FFFFFF"} />
      {showFullLoader && <FullScreenLoader />}
      <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.TABS} component={HomeTabsNavigator} />

        <Stack.Group>
          {accessToken ? (
            <></>
          ) : (
            <>
              {!isUserFirstInstall && (
                <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
              )}
              <Stack.Screen name={ROUTES.LOGINSCREEN} component={LoginScreen} />
              <Stack.Screen
                name={ROUTES.TOPIC_SELECTION}
                component={TopicSelection}
              />
              <Stack.Screen name={ROUTES.OTPSCREEN} component={OTPScreen} />
              <Stack.Screen
                name={ROUTES.VERIFY_PHONE_NUMBER}
                component={PhoneNumberInputScreen}
              />
              <Stack.Screen
                name={ROUTES.REGISTRATION}
                component={Registration}
              />
            </>
          )}
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name={ROUTES.CAMERA_PAGE} component={CameraPage} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
