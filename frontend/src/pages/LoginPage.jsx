import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { ImSpinner2 } from "react-icons/im";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/todo");
      } else {
        const backendMessage =
          resultAction.payload || resultAction.error?.message || "Login failed";

        if (
          backendMessage.toLowerCase().includes("user") &&
          backendMessage.toLowerCase().includes("not")
        ) {
          toast.error("User not found. Please register first.");
        } else if (
          backendMessage.toLowerCase().includes("invalid") ||
          backendMessage.toLowerCase().includes("password")
        ) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(backendMessage);
        }

        console.error("Login error:", backendMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-gray-700 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-teal-500/50">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Login to your account
        </h1>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500"
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
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg w-full p-3 transition-all focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full text-white font-bold text-lg rounded-lg px-8 py-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? (
              <ImSpinner2 className="animate-spin h-6 w-6 text-teal-300" />
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-teal-400 hover:text-teal-500 transition-all duration-300"
              >
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
