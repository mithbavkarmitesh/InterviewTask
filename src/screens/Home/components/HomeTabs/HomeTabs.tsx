import * as React from "react";
import { useWindowDimensions } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";

import { useTheme } from "@/theme";
import Feed from "../Feed/Feed";
import useHomeTabsController from "./Controller";
import TrendingView from "../Trending/TrendingView";

// const renderScene = SceneMap({
//   first: Feed,
//   second: TrendingView,
// });

export default function HomeTabs() {
  const { colors, fonts, backgrounds } = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "For You", keyIndex: 0 },
    { key: "second", title: "Trending", keyIndex: 1 },
  ]);
  
  const {} = useHomeTabsController();

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case "first":
        return <Feed index={index} />;
      case "second":
        return <TrendingView index={index} />;
        return null;
    }
  };
  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<any> }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.green }}
      style={backgrounds.topTab}
      labelStyle={[
        fonts.topicTextColor,
        fonts.boldFont,
        { textTransform: "none", fontSize: 16 },
      ]}
    />
  );

  return (
    <TabView
      lazy={({ route }) => route.title === "Trending"}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
