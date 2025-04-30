import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Safely load from localStorage
let storedUser = null;
try {
  const userFromStorage = localStorage.getItem("user");
  if (userFromStorage) {
    storedUser = JSON.parse(userFromStorage);
  }
} catch (error) {
  console.error("Error parsing user data from localStorage:", error);
}

const token = localStorage.getItem("token") || null;

const initialState = {
  user: storedUser,
  token: token,
  error: null,
};

// Async login action
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://to-do-app-eta-neon.vercel.app/api/auth/login",
        credentials
      );

      const { token, user } = response.data;

      // Debugging line to check the user data
      console.log("Login response user:", user);

      dispatch(setToken(token));
      dispatch(setUser(user));

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async register action
// Async register action
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://to-do-app-eta-neon.vercel.app/api/auth/register",
        credentials,
        { withCredentials: true }
      );

      const { token, user } = response.data;

      // Debugging line to check the user data
      console.log("Register response user:", user);

      // Ensure user data is valid before dispatching it
      if (!user) {
        throw new Error("User data is missing from the response");
      }

      dispatch(setToken(token));
      dispatch(setUser(user));

      // Save user to localStorage after successful registration
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setToken, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
