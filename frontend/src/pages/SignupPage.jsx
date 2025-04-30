import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";

const SignupPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Dispatch the register action
      const response = await dispatch(register(form)).unwrap();

      toast.success("Signup successful!");

      // Storing user and token in localStorage
      const { token, user } = response; // Assuming response contains token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Reset form and navigate to another page
      setForm({ username: "", email: "", password: "" });
      navigate("/todo");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Signup failed");
      console.error("Error during signup:", error);
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-gray-700 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 transition-all duration-500 hover:shadow-teal-500/50">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Create your account
        </h1>

        <form className="space-y-6" onSubmit={handleSignup}>
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
              disabled={isLoading}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
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
              disabled={isLoading}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
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
              disabled={isLoading}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-bold text-lg rounded-lg px-8 py-3 flex items-center justify-center space-x-2 transition-all transform hover:scale-105 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <Link
                to="/"
                className="text-teal-400 hover:text-teal-500 transition-all duration-300"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
