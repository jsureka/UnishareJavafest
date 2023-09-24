import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user slice

const initialState = {
  product: null,
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
  },
});

export const { setProduct, updateProduct, deleteProduct } =
  productSlice.actions;
export default productSlice.reducer;
