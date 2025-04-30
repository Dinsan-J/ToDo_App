import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import todoReducer from "./todoSlice";
// Use named import instead of default import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});
