import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const checkboxSlice = createSlice({
  name: "checkbox",
  initialState,
  reducers: {
    setCheckBox(state, actions) {
      console.log(`action ${actions.payload}`);
      return actions.payload;
    },
  },
});

// Export actions and reducer
export const { setCheckBox } = checkboxSlice.actions;
export default checkboxSlice.reducer;
