import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = [];

const chapterSlice = createSlice({
  name: "chaters",
  initialState,
  reducers: {
    setCompletedChapters(state, actions) {
      return actions.payload;
    },
  },
});

// Export actions and reducer
export const { setCompletedChapters } = chapterSlice.actions;
export default chapterSlice.reducer;
