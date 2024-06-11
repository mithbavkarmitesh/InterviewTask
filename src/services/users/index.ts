import { genericSchema } from "@/types/schemas/auth";
import { instance } from "../instance";
import { selectUser } from "@/store/userSlice";
import { store } from "@/store";
import { Endpoints } from "../endpoints";

export { default as fetchOne } from "./fetchOne";

/**
 * Get Partial User Info by using Mobile Number
 * @param mobileNo
 * @returns
 */
export const getUserInfo = async (mobileNo: string) => {
  const response = await instance
    .get(`postgres/app-user/getinfo?mobileNo=${encodeURIComponent(mobileNo)}`)
    .json();
  return genericSchema.parse(response);
};

/**
 * Get Complete User Info by using JWT token
 * @returns Userinfo object
 */
export const getCompleteUserInfo = async () => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(Endpoints.UserInformation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

/**
 * Get all posts of the user
 * @returns - All posts of the user
 */
export const getUserAllPosts = async (pageParam = 0) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(Endpoints.UserAllPosts + `?page=${pageParam}&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

/**
 * Get all images of the user
 * @returns  - All images of the user
 */
export const getUserAllImages = async () => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(Endpoints.UserAllImages, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

/**
 * Get all videos of the user
 * @returns - All videos of the user
 */
export const getUserAllVideos = async () => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(Endpoints.UserAllVideos, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};
export const getFollowingCounter = async () => {
  const { accessToken, username } = selectUser(store?.getState());
  const response = await instance
    .get(Endpoints.FollowingCounter + `${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const getFollowersCounter = async () => {
  const { accessToken, username } = selectUser(store?.getState());
  const response = await instance
    .get(Endpoints.FollowersCounter + `${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const getFriendsCounter = async () => {
  const { accessToken, username } = selectUser(store?.getState());
  const response = await instance
    .get(Endpoints.FriendsCounter + `${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const getAllCounters = async () => {
  const { accessToken, username } = selectUser(store?.getState());
  const response = await instance
    .get(Endpoints.AllCounter + `${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json();
  return response;
  // return genericSchema.parse(response);
};

export const addDisplayPhoto = async (remoteUri: String) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.AddDisplayPhoto + `?addDisplayPhoto=${remoteUri}`, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const removeDisplayPhoto = async () => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.RemoveDisplayPhoto, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const addCoverPhoto = async (remoteUri: String) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.AddCoverPhoto + `?addCoverPhoto=${remoteUri}`, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};

export const removeCoverPhoto = async () => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.RemoveCoverPhoto, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};
