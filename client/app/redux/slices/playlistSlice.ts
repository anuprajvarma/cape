import { createSlice } from "@reduxjs/toolkit";
import { playlistType } from "@/types";

const initialState: playlistType[] = [];

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setPopularPlaylist(state, actions) {
      return actions.payload; // Payload should be playlistType[]
    },
  },
});

// Export actions and reducer
export const { setPopularPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
