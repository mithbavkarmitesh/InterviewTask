import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";
import { useIsFocused } from "@react-navigation/native";
import useTypedNavigation from "./hooks";
import { TabsParamsList } from "@/types/navigation";
import { BaseView } from "@/components/atoms";
import { HomeScreen, PostScreen, ProfileScreen } from "@/screens";

import { ROUTES } from "@/utils/routes";
import Images from "@/theme/assets/images";
import SearchScreen from "@/screens/Search/SearchScreen";

const { width, height } = Dimensions.get("window"),
  TAB_BAR_WIDTH = width / 5;

const Tab = createBottomTabNavigator<TabsParamsList>();

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
  },
  innerView: {
    paddingVertical: Math.floor(height * 0.022),
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    width: TAB_BAR_WIDTH,
    textAlign: "center",
  },
  iconSize: {
    height: 24,
    width: 24,
  },
});

const getTabIcon = ({ tabName, isFocused }: any) => {
  switch (tabName) {
    case ROUTES.HOME: {
      return isFocused
        ? Images.icons.homeActiveIcon
        : Images.icons.homeInactiveIcon;
    }

    case ROUTES.POST: {
      return isFocused
        ? Images.icons.addPostActiveIcon
        : Images.icons.addPostInactiveIcon;
    }
    case ROUTES.SEARCH: {
      return isFocused
        ? Images.icons.searchInactiveIcon
        : Images.icons.searchInactiveIcon;
    }
    case ROUTES.PROFILE: {
      return isFocused
        ? Images.icons.profileActiveIcon
        : Images.icons.profileInactiveIcon;
    }
    default:
      return Images.icons.searchInactiveIcon;
  }
};
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.tabBackground,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel as string) || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const imageSource = getTabIcon({
          tabName: route.name,
          isFocused,
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
            key={index}
          >
            <View style={styles.innerView}>
              <Image
                style={styles.iconSize}
                resizeMode={"contain"}
                source={imageSource}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeTabsNavigator = () => {
  const navigator = useTypedNavigation();
  const isFocus = useIsFocused();

  return (
    <>
      {/* <StatusBar backgroundColor={Colors.white} /> */}
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        initialRouteName={ROUTES.HOME}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            // paddingBottom: 50,
          },
        }}
      >
        <Tab.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
          options={{
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name={ROUTES.POST}
          component={PostScreen}
          options={{
            tabBarLabel: "",
          }}
        />
        <Tab.Screen
          name={ROUTES.SEARCH}
          component={SearchScreen}
          options={{
            tabBarLabel: "",
          }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE}
          component={ProfileScreen}
          options={{
            tabBarLabel: "",
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeTabsNavigator;
