const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Callback function after successful Google OAuth login
const googleCallback = async (req, res) => {
  const user = req.user; // User object attached by Passport.js after successful Google login

  // Generate JWT token with user ID and role
  const token = jwt.sign(
    { id: user._id, role: user.role }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Token expiry
  );

  // --- Cookie-based token sending ---
  /*
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  */

  // Send token in response body (frontend should store it in localStorage)
  res.status(200).json({
    message: "Login successful",
    token: token, // Send JWT directly in response
    role: user.role,
    name: user.name,
    email: user.email,
  });
};

module.exports = { googleCallback };
