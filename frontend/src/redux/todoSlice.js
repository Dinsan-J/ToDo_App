import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/todos";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found.");

    try {
      const res = await axios.get(`${BASE_URL}/fetchTodos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (text, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found.");

    try {
      const res = await axios.post(
        `${BASE_URL}/addtodo`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found.");

    try {
      const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found.");

    try {
      const res = await axios.patch(`${BASE_URL}/toggle/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      // const response = await axios.put(`/api/todos/${id}`, { text });
      const response = await axios.put(`${BASE_URL}/${id}`, { text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Update failed");
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetTodos: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (todo) => todo._id !== action.payload._id
        );
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((t) => t._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      });
  },
});

export const { resetTodos } = todoSlice.actions;
export default todoSlice.reducer;
