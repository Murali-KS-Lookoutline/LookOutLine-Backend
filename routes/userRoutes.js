const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  deleteUser,
  updateUser,
  getUserProfile,
  getUserByRole,
} = require("../controllers/userController");

const router = express.Router();
router.route("/:role").get(getUserByRole);

router.route("/:id").delete(protect, authorize("admin"), deleteUser);

router.route("/profile").put(protect, updateUser).get(protect, getUserProfile);

module.exports = router;
