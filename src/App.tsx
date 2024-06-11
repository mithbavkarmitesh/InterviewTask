import {
  QueryClient,
  QueryClientProvider,
  dataTagSymbol,
} from "@tanstack/react-query";

import { ThemeProvider } from "@/theme";

import ApplicationNavigator from "./navigators/Application";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CountryModalProvider } from "react-native-country-picker-modal";
import { storage, store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import { LogBox, Text, TextInput } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { IS_ANDROID } from "./utils/layoutUtils";
// import { enableScreens } from "react-native-screens";
// enableScreens();
LogBox.ignoreLogs(["new NativeEventEmitter"]);
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
}
const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider storage={storage}>
              <CountryModalProvider>
                <BottomSheetModalProvider>
                  <ApplicationNavigator />
                  {/* {IS_ANDROID ? <PushNotifications /> : null} */}
                </BottomSheetModalProvider>
                <Toast />
              </CountryModalProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
