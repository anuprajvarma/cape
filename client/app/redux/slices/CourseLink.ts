import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";
const CourseLinkSlice = createSlice({
  name: "CourseLink",
  initialState,
  reducers: {
    setCourseLink(state, actions) {
      return actions.payload;
    },
  },
});

// Export actions and reducer
export const { setCourseLink } = CourseLinkSlice.actions;
export default CourseLinkSlice.reducer;
