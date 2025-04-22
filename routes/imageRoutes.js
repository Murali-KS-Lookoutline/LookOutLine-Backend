const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createImage,
  getImages,
  deleteImage,
} = require("../controllers/imageController");

// Import the multer upload configuration
const upload = require("../config/multerConfig");

const router = express.Router();

// Route to create and get images
router
  .route("/")
  .post(protect, authorize("admin"), upload, createImage) // Use the Multer upload middleware
  .get(getImages);

router.route("/:id").delete(protect, authorize("admin"), deleteImage);

module.exports = router;
