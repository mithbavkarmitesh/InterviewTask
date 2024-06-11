import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from "react-native-blob-util";
import { IS_ANDROID, IS_IOS } from "./layoutUtils";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { Strings } from "@/constants";

const getAssetDataFromPath = (filePath: string) => {
  const name = filePath?.split?.("/").pop();
  const fileName =
    name?.split?.(".")?.[0] ||
    new Date()?.toISOString().concat(Math.random().toString());
  const extension = (name && name.split(".").pop()) ?? "jpg";

  return { fileName, extension };
};

const bytesToMegabytes = (bytes: number) => {
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
};

const uploadMediaToS3 = async (
  url: string,
  path: string,
  onUploadProgress: (sent: number, total: number) => void
) => {
  const config = {
    "Content-Type": "application/octet-stream",
  };
  return ReactNativeBlobUtil.fetch(
    "PUT",
    url,
    config,
    ReactNativeBlobUtil.wrap(path)
  )
    .uploadProgress(onUploadProgress)
    .then((res) => {
      const { status } = res.info();
      if (status === 200) return true;
      else {
        // Extract error information and throw a more specific error
        const errorMessage = res.text();
        throw new Error(
          `Upload failed with status ${status}. Error: ${errorMessage}`
        );
      }
    })
    .catch((error) => {
      throw new Error("Failed to upload media to S3.");
    });
};

function extractBaseUrl(urlWithParams: string): string | null {
  try {
    const parsedUrl = new URL(urlWithParams);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;
    return baseUrl;
  } catch (error) {
    return null;
  }
}

const getFileStatsData = async (path: string) => {
  let filePath = path;
  if (IS_IOS) filePath = path?.split("///")?.pop() ?? path;
  return await ReactNativeBlobUtil.fs.stat(filePath);
};

const checkFileWritePermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message:
            "This app needs access to your storage to download Photos or Videos",
          buttonPositive: "OK",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "Permission Request",
          "Please allow write permissions to download Photos or Videos.",
          [
            {
              text: "Go to Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
};
const downloadImageRemote = async (image_URL: string) => {
  // if (Platform.Version < "34" && !(await checkFileWritePermission())) {
  //   return;
  // }
  // Main function to download the image

  // To add the time suffix in filename
  let date = new Date();
  // Getting the extention of the file
  let { extension } = getAssetDataFromPath(image_URL);

  // Get config and fs from RNFetchBlob
  // config: To pass the downloading related options
  // fs: Directory path where we want our image to download
  const { config, fs } = ReactNativeBlobUtil;
  let PictureDir = fs.dirs.PictureDir;
  let options: ReactNativeBlobUtilConfig = {
    fileCache: true,
    addAndroidDownloads: {
      // Related to the Android only
      useDownloadManager: true,
      notification: true,
      path: ReactNativeBlobUtil.wrap(
        PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          extension
      ),
      description: "Image",
      mime: `image/${extension}`,
    },
  };
  config(options)
    .fetch("GET", image_URL)
    .then((res) => {
      // Showing alert after successful downloading

      Alert.alert("Image Downloaded Successfully.");
    })
    .catch((err) => {});
};

function extractFilenameFromURL(url: string) {
  // Use a regular expression to match the filename with extension
  const filenameRegex = /\/([^/]+)$/; // Matches the last part of the URL after the last '/'
  const match = url?.match(filenameRegex);

  if (match) {
    // Extract the matched filename with extension
    const filenameWithExtension = match[1];
    return filenameWithExtension;
  } else {
    // Return a default value or handle the case when no match is found
    return null;
  }
}

function getAssetRemoteSource(url: string) {
  if (url.includes("google")) {
    return url;
  }
  const filenameWithExtension = extractFilenameFromURL(url);
  return filenameWithExtension
    ? Strings.CDN_URL.concat(filenameWithExtension)
    : url;
}

export {
  bytesToMegabytes,
  extractBaseUrl,
  getAssetDataFromPath,
  uploadMediaToS3,
  getFileStatsData,
  downloadImageRemote,
  extractFilenameFromURL,
  getAssetRemoteSource,
};
