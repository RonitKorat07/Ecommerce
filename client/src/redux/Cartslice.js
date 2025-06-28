import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add to Cart Thunk
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, selectedSize, selectedColor, quantity }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId,
        selectedSize,
        selectedColor,
        quantity,
      });
      console.log("add data",res.data); 
      return res.data;
       // { message, cart }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Fetch Cart Thunk
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      console.log("data" ,res.data.cart.items);
      return res.data.cart.items;
       // array of cart items
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Remove From Cart Thunk
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, itemId }, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${userId}/${itemId}`);
      return itemId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
    }
  }
);

// New: Update Cart Quantity Thunk
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity , selectedSize, selectedColor}, thunkAPI) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/cart/update/${userId}`, {
        productId,
        quantity,
        selectedSize,
        selectedColor,
      });
      return res.data.cart.items; // updated cart items array
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update quantity");
    }
  }
);

export const fetchCheckoutSummary = createAsyncThunk(
  "cart/fetchCheckoutSummary",
  async ({ userId, cartItems }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/checkoutsummary", {
        userId,
        cartItems,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch checkout summary");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    checkoutSummary: null, // ✅ add this
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCartQuantity (new)
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;  // replace items with updated items
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         // Checkout summary thunk handlers
      .addCase(fetchCheckoutSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckoutSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutSummary = action.payload;
      })
      .addCase(fetchCheckoutSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
