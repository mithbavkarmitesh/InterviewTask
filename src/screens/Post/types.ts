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

export enum FileType {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  NONE = "NONE",
}

export enum Restrictions {
  PUBLIC_POST = "PUBLIC_POST", // public for all users
  PRIVATE_OWN_POST = "PRIVATE_OWN_POST", // only the owner of the post will see it
  PRIVATE_FRIENDS = "PRIVATE_FRIENDS", // only friends will see this
  PRIVATE_FAMILY = "PRIVATE_FAMILY", // only family will see this
  PRIVATE_FRIENDS_AND_FAMILY = "PRIVATE_FRIENDS_AND_FAMILY", // both friends and family members will see this
}
