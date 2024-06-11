// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface UserInfo {
  userId: number;
  userName: string;
  entityActive: boolean;
  firstName: string;
  surName: string;
  married: string;
  mobileNo: string;
  role: any | null;
  state: any | null;
  country: any | null;
  gender: any | null;
  interestAndHobbies: any | null;
  dateOfBirth: any | null;
  addedBy: any | null;
  displayPhoto: any | null;
  coverPhoto: any | null;
  postCounter: number;
  familyMemberCounter: number;
  followers: number;
  following: number;
}

interface UserState {
  username: string | null;
  accessToken: string | null;
  token: string | null;
  fcmToken: string | null;
  userInfo: UserInfo | null;
}

const initialState: UserState = {
  username: null,
  accessToken: null,
  fcmToken: null,
  token: null,
  userInfo: null,
  userPosts: null,
  userImages: null,
  userVideos: null,
  followingCounter: null,
  followersCounter: null,
  friendsCounter: null,

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return { ...initialState };
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
    setUserPosts: (state, action: PayloadAction<any>) => {
      state.userPosts = action.payload;
    },
    setUserImages: (state, action: PayloadAction<any>) => {
      state.userImages = action.payload;
    },
    setUserVideos: (state, action: PayloadAction<any>) => {
      state.userVideos = action.payload;
    },
    setFollowingCounter: (state, action: PayloadAction<number>) => {
      state.followingCounter = action.payload;
    },
    setFollowersCounter: (state, action: PayloadAction<number>) => {
      state.followersCounter = action.payload;
    },
    setFriendsCounter: (state, action: PayloadAction<number>) => {
      state.friendsCounter = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setToken,
  setUserInfo,
  setFcmToken,
  setUserPosts,
  setUserImages,
  setUserVideos,
  setFollowingCounter,
  setFollowersCounter,
  setFriendsCounter,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.UserReducer;

export default userSlice.reducer;

