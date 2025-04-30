import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Example: create user logic (you should have something like this)
    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({ message: "User registered successfully", token });
    // Optionally return token in JSON too (optional)
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Logout User (Client should handle token deletion)
export const logoutUser = (req, res) => {
  // If using cookies, clear the cookie
  // res.clearCookie("token"); // if you used cookies for auth

  // For token-based logout (no server storage), simply return success
  res.json({ message: "Logged out successfully" });
};
