import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./slices/playlistSlice";

export const store = configureStore({
  reducer: {
    playlist: playlistReducer,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
