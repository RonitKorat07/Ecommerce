import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ cartitem, formData, summaryData, userId }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/order/placeorder', {
        userId,
        items: cartitem.map(item => ({
          productId:item.productId._id,  // support both populated or plain id
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })), // cartitem is an array of items
        shippingAddress: {
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        tax: summaryData.tax,
        shippingCharges: summaryData.shipping,
        discount: summaryData.discount,
        totalPrice: summaryData.subtotal,    // from summary
        finalPrice: summaryData.totalAmount, // final price including tax, discount, shipping
      });

      console.log(response.data.order);
      return response.data.order;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Fetch all orders for admin with pagination support
export const fetchAdminOrders = createAsyncThunk(
  'order/fetchAdminOrders',
  async (page = 1, thunkAPI) => {  // accept page param, default 1
    try {
      const response = await axios.get(`http://localhost:5000/api/order/admin/all?page=${page}`);
      // API returns { orders, totalOrders, currentPage, totalPages, ... }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch user-specific orders for given userId (no pagination)
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/order/user/${userId}`);
      return response.data.orders; // assuming API returns { orders: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    userOrders: [],
    adminOrders: [],
    adminTotalOrders: 0,
    adminCurrentPage: 1,
    adminTotalPages: 1,
    error: null,
    placedOrder: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.userOrders = [];
      state.adminOrders = [];
      state.error = null;
      state.loading = false;
      state.placedOrder = null;
      state.adminTotalOrders = 0;
      state.adminCurrentPage = 1;
      state.adminTotalPages = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Place order cases (you already have these)
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.placedOrder = action.payload;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch admin orders with pagination
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload.orders;
        state.adminTotalOrders = action.payload.totalOrders;
        state.adminCurrentPage = action.payload.currentPage;
        state.adminTotalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user orders (no pagination)
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
