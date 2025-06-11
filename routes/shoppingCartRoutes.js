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
  .post(protect, createCart)
  .get(protect, getCart)
  .put(protect, updateCart)
  .delete(protect, deleteCart);

module.exports = router;
