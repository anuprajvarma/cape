import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;
const CourseLinkModalSlice = createSlice({
  name: "CourseLinkModal",
  initialState,
  reducers: {
    setCourseLinkModal(state, actions) {
      return actions.payload;
    },
  },
});

// Export actions and reducer
export const { setCourseLinkModal } = CourseLinkModalSlice.actions;
export default CourseLinkModalSlice.reducer;
