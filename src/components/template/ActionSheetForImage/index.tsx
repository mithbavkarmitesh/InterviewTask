import { BaseView } from "@/components/atoms";
import { useTypedSelector } from "@/store";
import {
  Pressable,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
const { FlutterModuleStarter } = NativeModules;
const eventEmitter = new NativeEventEmitter(FlutterModuleStarter);

type Props = {
  captureImage?: () => void;
  onCancel: () => void;
  openImageLibrary?: () => void;
  removeImage?: () => void;
  imageType?: string;
};
export default ({
  imageType,
  captureImage,
  onCancel,
  openImageLibrary,
  removeImage,
}: Props) => {
  const userInfo = useTypedSelector((store) => store.UserReducer.userInfo);

  eventEmitter.addListener("FlutterData", (data) => {
    console.log("Data from Flutter:", data);
  });

  const startFlutterCameraScreen = () => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0MDEiLCJpYXQiOjE3MTU5NjY2ODcsImV4cCI6MTcxNzY5NDY4N30.FPIUav8iy3pz4uaFRHhEReEuIFYViWtbvKc_p4wr928";
    FlutterModuleStarter.startFlutterVideoScreen((msg: any) => {
      console.log("From Flutter: ", msg);
    });
  };

  const startFlutterMediaPickerScreen = () => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0MDEiLCJpYXQiOjE3MTU5NjY2ODcsImV4cCI6MTcxNzY5NDY4N30.FPIUav8iy3pz4uaFRHhEReEuIFYViWtbvKc_p4wr928";
    FlutterModuleStarter.startFlutterMediaPickerScreen(
      accessToken,
      (msg: any) => {
        console.log("From Flutter: ", msg);
      }
    );
  };

  return (
    <BaseView style={{ height: "100%", padding: 15 }}>
      <Text style={{ fontWeight: "600", fontSize: 18, marginBottom: 5 }}>
        Select Image
      </Text>
      <View
        style={{
          marginVertical: 10,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Pressable style={{}} hitSlop={20} onPress={startFlutterCameraScreen}>
          <Text style={{ fontSize: 18 }}>Take Photo...</Text>
        </Pressable>
        <Pressable hitSlop={20} onPress={startFlutterMediaPickerScreen}>
          <Text style={{ fontSize: 18 }}>Choose from Gallery...</Text>
        </Pressable>
        {imageType === "profilePicture" && userInfo?.displayPhoto?.value && (
          <Pressable onPress={removeImage}>
            <Text style={{ fontSize: 18, color: "red" }}>
              Remove Profile Picture
            </Text>
          </Pressable>
        )}
        {imageType === "coverPhoto" && userInfo?.coverPhoto?.value && (
          <Pressable onPress={removeImage}>
            <Text style={{ fontSize: 18, color: "red" }}>
              Remove Cover Photo
            </Text>
          </Pressable>
        )}
        <Pressable onPress={onCancel}>
          <Text style={{ fontSize: 18 }}>Cancel</Text>
        </Pressable>
      </View>
    </BaseView>
  );
};
