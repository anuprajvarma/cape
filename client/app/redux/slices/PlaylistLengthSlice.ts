import { createSlice } from "@reduxjs/toolkit";

const initialState: number = 0;

const playlistLengthSlice = createSlice({
  name: "playListLength",
  initialState,
  reducers: {
    setPlayListLength(state, actions) {
      return actions.payload;
    },
  },
});

export const { setPlayListLength } = playlistLengthSlice.actions;
export default playlistLengthSlice.reducer;
