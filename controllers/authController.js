const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );
    res.status(201).json({ token });
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
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    // Invalidate the token (optional: store it in a blacklist)
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ message: "Logout failed", error: err.message });
  }
};

module.exports = { signup, login, logout };
