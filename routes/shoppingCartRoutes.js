const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createCart,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/shoppingCartController");

const router = express.Router();

router
  .route("/")
  // .post(protect, authorize("admin"), createService)
  .post(createCart)
  .get(protect, getCart); // Get all products (with optional filtering)

router.route("/:id").put(updateCart).delete(deleteCart);

module.exports = router;
