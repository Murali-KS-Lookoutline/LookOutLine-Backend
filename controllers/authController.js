const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");

dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // --- Cookie-based token (commented out) ---
    /*
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    */

    res.status(201).json({
      message: "User registered successfully",
      token: token, // Send token in response for localStorage
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "User registration failed", error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // --- Cookie-based token (commented out) ---
    /*
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    */

    res.status(200).json({
      message: "User login successful",
      token: token, // Send token in response for localStorage
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: err.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Reset your password using this link: ${resetUrl}`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    // Clear cookie (no longer used but left here in case you return to cookies later)
    /*
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    */

    res.status(200).json({
      message:
        "Logged out successfully (frontend should remove token from localStorage)",
    });
  } catch (err) {
    res.status(400).json({ message: "Logout failed", error: err.message });
  }
};

// @desc    Get current user info from token
// @route   GET /api/auth/me
const getCurrentUser = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      id: decoded.id,
      role: decoded.role,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { signup, login, logout, forgotPassword, getCurrentUser };
