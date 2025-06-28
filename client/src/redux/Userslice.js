import { createSlice } from '@reduxjs/toolkit';

// Initial state me token aur user ko localStorage se load karo
const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
