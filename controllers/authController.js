const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendEmail = require("../utils/sendMail");

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

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({ message: "User registered successfully" });
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
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({ message: "User Login successfull" });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: err.message });
  }
};

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

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ message: "Logout failed", error: err.message });
  }
};

module.exports = { signup, login, logout };
