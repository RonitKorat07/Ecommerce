import { configureStore } from '@reduxjs/toolkit'
import userReducer from './Userslice.js'; // Path to your userSlice
import categoryReducer from "./Categoryslice.js";
import productReducer from "./Productslice.js";
import cartReducer from "./Cartslice.js";
import orderReducer from "./Orderslice.js";

export default configureStore({
  reducer: {
    user: userReducer, // Add user reducer
    category: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,

  }
})