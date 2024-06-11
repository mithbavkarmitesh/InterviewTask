import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { ApplicationScreenProps } from "@/types/navigation";

export const navigationRef =
  createNavigationContainerRef<ApplicationScreenProps>();

export type NavigationArgs = {
  [Route in keyof ApplicationScreenProps]: [
    routeName: Route,
    routeParams?: ApplicationScreenProps[Route]
  ];
}[keyof ApplicationScreenProps];

const navigate = (name: any, params?: any): any => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

const reset = (routeName: string, params: any | null = {}) => {
  navigationRef.dispatch({
    ...CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params: params }],
    }),
  });
};

const push = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};

const pop = (count: number) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(count));
  }
};

const popToTop = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
};

const getRecentRoutes = () => {
  const rootState = navigationRef.current?.getRootState();
  const routes = rootState?.routes;
  const previousRoute = routes?.[routes?.length - 2];
  const currentRoute = routes?.[routes?.length - 1];
  return {
    //@ts-ignore
    currentRoute:
      currentRoute?.state?.index > -1 && currentRoute?.state?.routes
        ? currentRoute?.state?.routes?.[currentRoute?.state?.index]
        : currentRoute,
    //@ts-ignore
    previousRoute:
      previousRoute?.state?.index > -1 && previousRoute?.state?.routes
        ? previousRoute?.state?.routes?.[previousRoute?.state?.index]
        : previousRoute,
  };
};
// add other navigation functions that you need and export them

const setParams = (key: string, params: object | undefined) => {
  navigationRef.dispatch({
    type: "SET_PARAMS",
    payload: { params },
    source: key,
  });
};
const RootNavigation = {
  navigate,
  push,
  pop,
  popToTop,
  reset,
  getRecentRoutes,
  setParams,
};

export default RootNavigation;
