import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser, setToken } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { FiLogOut } from "react-icons/fi"; // Import logout icon

const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve user and token from Redux state
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // ✅ Check if the user and token are available in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // Safely parse the stored user, check if it's valid JSON
    try {
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
        dispatch(setToken(storedToken));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }

    // Optional cleanup function (if needed)
    return () => {
      // Cleanup actions if necessary
    };
  }, [dispatch]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      dispatch(logout());
      toast.success("Logged out successfully!");
      localStorage.removeItem("user"); // Remove user data from localStorage
      localStorage.removeItem("token"); // Remove token data from localStorage
      navigate("/login");
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg rounded-b-xl">
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 text-transparent bg-clip-text animate-pulse">
          ToDo_App
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Show username if logged in, else show "Guest" */}
        <span className="text-lg font-medium text-teal-300">
          Hello, {user ? user.username : "Guest"}
        </span>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition w-max"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <ImSpinner2 className="animate-spin h-5 w-5" /> Logging out...
            </>
          ) : (
            <>
              <FiLogOut className="h-5 w-5" /> Logout
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
