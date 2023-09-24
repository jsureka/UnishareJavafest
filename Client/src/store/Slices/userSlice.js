import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user slice
const initialState = {
  isAuthenticated: true, // You can initialize this to false
  currentUser: null,
  users: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Define reducers for updating the state
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteUser: (state, action) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    deleteUsers: (state, action) => {
      state.users = [];
    },
  },
});

// Export the actions and reducer
export const { setUser, updateUser, deleteUser, setUsers, deleteUsers } =
  userSlice.actions;
export default userSlice.reducer;
