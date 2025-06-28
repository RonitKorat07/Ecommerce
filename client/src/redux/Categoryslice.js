// redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET Categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch categories.");
    }
  }
);

// ADD Category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ name, image }, thunkAPI) => {
    try {
      await axios.post("http://localhost:5000/api/category/add", { name ,image });
      thunkAPI.dispatch(fetchCategories());
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add category.");
    }
  }
);

// DELETE Category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:5000/api/category/delete/${id}`);
      thunkAPI.dispatch(fetchCategories());
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete category.");
    }
  }
);

// UPDATE Category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name ,image}, thunkAPI) => {
    try {
      await axios.put(`http://localhost:5000/api/category/update/${id}`, { name ,image });
      thunkAPI.dispatch(fetchCategories());
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update category.");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
