import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user slice

const initialState = {
  product: null,
  myProducts: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      console.log(action);
      state.product = action.payload;
    },
    updateProduct: (state, action) => {
      state.product = action.payload;
    },
    deleteProduct: (state) => {
      state.product = null;
    },
    setMyProducts: (state, action) => {
      state.myProducts = action.payload;
    },
    updateMyProducts: (state, action) => {
      state.myProducts = action.payload;
    },
    deleteMyProducts: (state) => {
      state.myProducts = null;
    },
  },
});

export const {
  setProduct,
  updateProduct,
  deleteProduct,
  setMyProducts,
  updateMyProducts,
  deleteMyProducts,
} = productSlice.actions;

export default productSlice.reducer;
