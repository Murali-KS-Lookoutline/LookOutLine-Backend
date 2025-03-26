const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

router
  .route("/")
  // .post(protect, authorize("admin"), createService)
  .post(createService)
  .get(getServices); // Get all products (with optional filtering)

router
  .route("/:id")
  .get(getServiceById) // Get a single product by ID
  .put(updateService)
  .delete(deleteService);

module.exports = router;
