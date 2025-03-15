const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product creation failed", error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { brand, category, color, ...otherFilters } = req.query;

    // Build the filter object dynamically
    const filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (color) filter["technical_specifications.color"] = color;

    // Add other filters dynamically
    for (const key in otherFilters) {
      filter[key] = otherFilters[key];
    }

    // Fetch products based on the filter
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
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

const updateProduct = async (req, res) => {
  try {
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

const deleteProduct = async (req, res) => {
  try {
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
