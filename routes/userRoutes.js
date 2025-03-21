const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  deleteUser,
  updateUser,
  getUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router
  .route("/:id")
  .delete(protect, authorize("admin"), deleteUser)
  .put(protect, updateUser)
  .get(protect, getUserProfile);

module.exports = router;
