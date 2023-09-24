import { configureStore } from "@reduxjs/toolkit";
// Import your reducers
import categorySlice from "./Slices/categorySlice";
import productSlice from "./Slices/productSlice";
import userSlice from "./Slices/userSlice";
// import Reducer from "./Slices";
const store = configureStore({
  reducer: {
    user: userSlice,
    category: categorySlice,
    product: productSlice,
    // Reducer,
    // Add more reducers as needed
  },
});
export default store;
