import "./App.css";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoPage from "./pages/TodoPage";
import { useDispatch, useSelector } from "react-redux";
import { setToken, logout } from "./redux/authSlice"; // Add Redux actions for setting and clearing the token
import axios from "axios";

// Set the token in axios headers on app load
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get token from Redux state

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("token");

    if (tokenFromLocalStorage) {
      dispatch(setToken(tokenFromLocalStorage)); // Set token in Redux store
      setAuthToken(tokenFromLocalStorage); // Set axios auth token header
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    dispatch(logout()); // Clear the token from Redux store on logout
  };

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Default route to LoginPage */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* TodoPage is protected, redirect to login if no token */}
          <Route
            path="/todo"
            element={
              token ? (
                <TodoPage onLogout={handleLogout} /> // Pass logout function to TodoPage
              ) : (
                <Navigate to="/" /> // Redirect to login if no token
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
