const dotenv = require("dotenv");
const User = require("../models/User");
const { verifyToken } = require("../utils/auth");

dotenv.config();

const protect = async (req, res, next) => {
  // ✅ Get token from Authorization header (e.g., Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }
    next();
  };
};

module.exports = { protect, authorize };
