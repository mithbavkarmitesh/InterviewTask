import { LocationModalProps } from "@/screens/LocationScreen/types";
import { ROUTES } from "@/utils/routes";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import type {
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import type {
  StackScreenProps,
  StackNavigationProp,
} from "@react-navigation/stack";

export type OTPScreenProps = {
  mobileNumber?: string;
  countryCode?: string;
  email?: string;
};

export type TabsParamsList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.POST]: undefined;
  [ROUTES.SEARCH]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type ApplicationStackParamList = {
  [ROUTES.STARTUP]: undefined;
  [ROUTES.EXAMPLE]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.LOGINSCREEN]: undefined;
  [ROUTES.OTPSCREEN]: OTPScreenProps;
  [ROUTES.REGISTRATION]: OTPScreenProps & { password?: string; user?: string };
  [ROUTES.TOPIC_SELECTION]: { fields: string } | undefined;
  [ROUTES.TABS]: NavigatorScreenParams<TabsParamsList>;
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.VERIFY_PHONE_NUMBER]: { user: string } | undefined;
  [ROUTES.SETTINGS_SCREEN]: undefined;
  [ROUTES.EDIT_PROFILE]: undefined;
  [ROUTES.CAMERA_PAGE]: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

export type OTPScreenNavigationProp = RouteProp<
  ApplicationStackParamList,
  ROUTES.OTPSCREEN
>;
export type RegistrationScreenNavigationProp = RouteProp<
  ApplicationStackParamList,
  ROUTES.REGISTRATION
>;

export type TopicSelectionScreenNavigationProp = RouteProp<
  ApplicationStackParamList,
  ROUTES.TOPIC_SELECTION
>;
