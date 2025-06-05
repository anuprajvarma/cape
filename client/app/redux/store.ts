import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./slices/playlistSlice";
import checkboxSlice from "./slices/checkboxSlice";

export const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    checkbox: checkboxSlice,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
