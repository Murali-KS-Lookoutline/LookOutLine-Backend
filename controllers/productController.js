const Product = require("../models/Product");
const mongoose = require("mongoose");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { productName, category, brand } = req.body;
    const imageFiles = req.files;

    console.log(imageFiles);
    // Basic validation for required fields
    if (!productName || !category || !brand) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Extract file paths (relative or full URL as needed)
    let imageUrls = [];
    if (Array.isArray(imageFiles)) {
      imageUrls = imageFiles.map(
        (file) => `/uploads/productUploads/${file.filename}`
      );
    }

    // Combine imageUrls into the product object
    const productData = {
      ...req.body,
      imageUrls: imageUrls,
    };

    if (typeof req.body.specifications === "string") {
      req.body.specifications = JSON.parse(req.body.specifications);
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Product creation failed",
      error: err.message,
    });
    return;
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Parse nested JSON strings if necessary
    if (typeof req.body.metadata === "string") {
      try {
        req.body.metadata = JSON.parse(req.body.metadata);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid metadata format" });
      }
    }

    if (typeof req.body.specifications === "string") {
      try {
        req.body.specifications = JSON.parse(req.body.specifications);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Invalid specifications format" });
      }
    }

    const imageFiles = req.files;
    let imageUrls = [];

    if (Array.isArray(imageFiles)) {
      imageUrls = imageFiles.map(
        (file) => `/uploads/productUploads/${file.filename}`
      );
    }

    // Combine imageUrls only if new images are uploaded
    const updatedData = {
      ...req.body,
    };

    if (imageUrls.length > 0) {
      updatedData.imageUrls = imageUrls;
    }

    if (typeof req.body.specifications === "string") {
      req.body.specifications = JSON.parse(req.body.specifications);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Product update failed", error: err.message });
  }
};

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
    // const pageNum = parseInt(page) || 1;
    // const limitNum = parseInt(limit) || 10;
    const pageNum = 1;
    const limitNum = 10;

    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter).skip(skip).limit(limitNum);
    const formattedProducts = products.map((product) => product.toObject());

    res
      .status(200)
      .json({ page: pageNum, limit: limitNum, products: formattedProducts });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Convert _id to id
    const formattedProduct = {
      id: product._id,
      ...product.toObject(),
    };

    res.status(200).json(formattedProduct);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch product", error: err.message });
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
