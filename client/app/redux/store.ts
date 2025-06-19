import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./slices/playlistSlice";
import checkboxSlice from "./slices/checkboxSlice";
import chapterHandleSlice from "./slices/chapterHandleSlice";
import LoginModalSlice from "./slices/LoginModalSlice";
import CourseLinkModalSlice from "./slices/CourseLinkModal";
import CourseLink from "./slices/CourseLink";

export const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    checkbox: checkboxSlice,
    chapters: chapterHandleSlice,
    checkModal: LoginModalSlice,
    CourseLinkModal: CourseLinkModalSlice,
    CourseLink: CourseLink,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
