import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔄 Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await axios.get("http://localhost:5000/api/product");
  return res.data.products;

});

// ➕ Add product
export const addProduct = createAsyncThunk("products/add", async (productData) => {
  const res = await axios.post("http://localhost:5000/api/product/add", productData);
  return res.data;
});

// ❌ Delete product
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await axios.delete(`http://localhost:5000/api/product/delete/${id}`);
  return id;
});

// ✏️ Update product
export const updateProduct = createAsyncThunk("products/update", async ({ id, data }) => {
  const res = await axios.put(`http://localhost:5000/api/product/update/${id}`, data);
  return res.data;
});

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const res = await axios.get(`http://localhost:5000/api/product/${id}`);
    return res.data.product;  // Assuming res.data is the product object
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  "products/fetchRecommendedProducts",
  async ({ categoryId, excludeId }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/filter?category=${categoryId}&exclude=${excludeId}`
      );
      const data = await response.json();
      return data.products;  // assuming API returns { products: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch recommended products");
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    recommendedProducts: [],
    loading: false,
    error: null,
    currentProduct: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by id 

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload; // store the single product here
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetch recommended
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;
