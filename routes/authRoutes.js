const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  getCurrentUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.get("/me", getCurrentUser);
router.post("/logout", protect, logout);

module.exports = router;
