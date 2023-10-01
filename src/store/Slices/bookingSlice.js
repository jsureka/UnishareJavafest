import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booking: null,
  myBookings: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      console.log(action);
      state.booking = action.payload;
    },
    updateBooking: (state, action) => {
      state.booking = action.payload;
    },
    deleteBooking: (state) => {
      state.booking = null;
    },
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    updateMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    deleteMyBookings: (state) => {
      state.myBookings = null;
    },
  },
});

export const {
  setBooking,
  updateBooking,
  deleteBooking,
  setMyBookings,
  updateMyBookings,
  deleteMyBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
