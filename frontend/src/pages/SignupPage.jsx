import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios"; // Import axios to make HTTP requests
import { register } from "../redux/authSlice";
import { useDispatch } from "react-redux"; // Add this at the top

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setIsLoading(true);

    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const token = await dispatch(register(form)).unwrap(); // ✅ Dispatch register thunk

      toast.success("Signup successful!");
      setForm({ username: "", email: "", password: "" }); // clear form

      // Redirect after signup
      navigate("/todo");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists");
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error("Error during signup:", error);
    }

    setIsLoading(false);
  };

  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-gray-700 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-teal-500/50">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Create your account
        </h1>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full text-white font-bold text-lg rounded-lg px-8 py-3 text-center flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <ImSpinner2 className="animate-spin h-6 w-6 text-teal-300" />
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/"
                className="text-teal-400 hover:text-teal-500 transition-all duration-300"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
