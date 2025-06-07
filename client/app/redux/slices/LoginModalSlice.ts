import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const loginModalSlice = createSlice({
  name: "modalCheck",
  initialState,
  reducers: {
    setIsOpen(state, actions) {
      return actions.payload;
    },
  },
});

// Export actions and reducer
export const { setIsOpen } = loginModalSlice.actions;
export default loginModalSlice.reducer;
