const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("admin"), createProduct)
  .get(getProducts); // Get all products (with optional filtering)

router
  .route("/:id")
  .get(getProductById) // Get a single product by ID
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

module.exports = router;
