const Product = require("../models/Product");
const mongoose = require("mongoose");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { productName, category, brand, imageUrls } = req.body;

    // Basic validation for required fields
    if (!productName || !category || !brand) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure imageUrls is an array
    if (imageUrls && !Array.isArray(imageUrls)) {
      return res.status(400).json({ message: "imageUrls should be an array" });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product creation failed", error: err.message });
  }
};

// Get All Products (with filtering and pagination)
const getProducts = async (req, res) => {
  try {
    const {
      brand,
      category,
      color,
      sku,
      productCategory,
      channels,
      cameraType,
      megapixel,
      ...otherFilters
    } = req.query;

    const filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (color) filter["technical_specifications.color"] = color;
    if (sku) filter.sku = sku;
    if (productCategory) filter.productCategory = productCategory;
    if (channels) filter.channels = channels;
    if (cameraType) filter.cameraType = cameraType;
    if (megapixel) filter.megapixel = megapixel;

    Object.assign(filter, otherFilters);

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter).skip(skip).limit(limit);
    res.status(200).json({ page, limit, products });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch product", error: err.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product update failed", error: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product deletion failed", error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
