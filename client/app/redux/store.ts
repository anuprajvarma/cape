import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./slices/playlistSlice";
import checkboxSlice from "./slices/checkboxSlice";
import chapterHandleSlice from "./slices/chapterHandleSlice";
import LoginModalSlice from "./slices/LoginModalSlice";

export const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    checkbox: checkboxSlice,
    chapters: chapterHandleSlice,
    checkModal: LoginModalSlice,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
