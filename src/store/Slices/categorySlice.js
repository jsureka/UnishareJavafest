import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user slice
const initialState = {
  category: null,
};

// Create the user slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Action to set the user data
    setCategory: (state, action) => {
      console.log(action);
      state.category = action.payload;
    },

    // Action to update the user data
    updateCategory: (state, action) => {
      // Assuming action.payload contains the updated user data
      state.category = action.payload;
    },

    // Action to delete the user data
    deleteCategory: (state) => {
      state.category = null;
    },
  },
});

// Export the actions and reducer
export const { setCategory, updateCategory, deleteCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
