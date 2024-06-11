import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import commonSlice from "./commonSlice";

const reducers = {
  UserReducer: userSlice,
  CommonReducer: commonSlice,
};

export const rootReducer = combineReducers<typeof reducers>(reducers);
