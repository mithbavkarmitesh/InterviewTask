import { Image, Video } from "react-native-image-crop-picker";

export enum CameraActions {
  Photo = "Take Photo",
  Gallery = "Choose from Gallery",
  Cancel = "Cancel",
  Video = "Take Video",
}

export type ImageType = Image & { remoteUri?: string };
export type VideoType = Video & { remoteUri?: string };
export type MediaList = ImageType | VideoType;
