import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async login action
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      credentials
    ); // ✅ Correct URL
    const token = response.data.token;
    dispatch(setToken(token));
    return token;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { dispatch }) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      credentials
    ); // ✅ Makes signup request to backend

    const token = response.data.token; // ✅ Extract token from response

    dispatch(setToken(token)); // ✅ Store token in Redux (assuming setToken action saves it)

    return token; // ✅ Returns token (optional but fine)
  }
);

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null, // Persist token in localStorage
    user: null,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Save token to localStorage
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token"); // Remove token on logout
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      // Handle successful login response, like saving user info
      // Example: state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message; // Handle login error
    });
  },
});

export const { setToken, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
