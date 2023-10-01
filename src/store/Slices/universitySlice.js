import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  university: null,
};

const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {
    setUniversity: (state, action) => {
      console.log(action);
      state.university = action.payload;
    },
    updateUniversity: (state, action) => {
      state.university = action.payload;
    },
    deleteUniversity: (state) => {
      state.university = null;
    },
  },
});

export const { setUniversity, updateUniversity, deleteUniversity } =
  universitySlice.actions;

export default universitySlice.reducer;
