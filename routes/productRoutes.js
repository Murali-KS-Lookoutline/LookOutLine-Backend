const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Import the multer upload configuration
const imageUpload = require("../config/multerConfigs/productConfig");

const router = express.Router();

router
  .route("/")
  // .post(protect, authorize("admin"), createProduct)
  .post(imageUpload, protect, authorize("admin", "vendor"), createProduct)
  .get(getProducts); // Get all products (with optional filtering)

router
  .route("/:id")
  .get(getProductById) // Get a single product by ID
  .put(imageUpload, protect, authorize("admin", "vendor"), updateProduct)
  .delete(protect, authorize("admin", "vendor"), deleteProduct);

module.exports = router;
