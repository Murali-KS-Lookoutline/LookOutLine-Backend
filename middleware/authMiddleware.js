const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const { verifyToken } = require("../utils/auth");

dotenv.config();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
