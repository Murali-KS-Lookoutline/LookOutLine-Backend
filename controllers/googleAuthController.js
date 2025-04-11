const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleCallback = async (req, res) => {
  const user = req.user; // This comes from passport after login

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  // Redirect with token (frontend should handle this route)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "Login successful",
    role: user.role,
    name: user.name,
    email: user.email,
  });
};

module.exports = { googleCallback };
