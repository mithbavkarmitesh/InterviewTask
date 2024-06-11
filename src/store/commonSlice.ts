// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface CommonState {
  isUserFirstInstall: boolean;
  showFullLoader: boolean;
  isManuallyThemeEnabled: boolean | null;
}

const initialState: CommonState = {
  isUserFirstInstall: false,
  showFullLoader: false,
  isManuallyThemeEnabled: null,
};

const commonUserSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setUserFirstInstall: (state, action: PayloadAction<boolean>) => {
      return { ...state, isUserFirstInstall: action.payload };
    },
    showFullScreenLoader: (state, action: PayloadAction<boolean>) => {
      state.showFullLoader = action.payload;
    },
    setManuallyThemeEnabled: (state, action: PayloadAction<boolean | null>) => {
      state.isManuallyThemeEnabled = action.payload;
    },
  },
});

export const {
  setUserFirstInstall,
  showFullScreenLoader,
  setManuallyThemeEnabled,
} = commonUserSlice.actions;

export default commonUserSlice.reducer;
