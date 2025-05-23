const ShoppingCart = require("../models/ShoppingCart");
const mongoose = require("mongoose");

// Create Cart
const createCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.create(req.body);
    res.status(201).json(cart);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Unable to save cart", error: err.message });
  }
};

// Get Carts
const getCart = async (req, res) => {
  try {
    const cartItems = await ShoppingCart.find({ userId: req.user.id }).populate(
      "product_id"
    );

    // Flatten product data into main object
    const cart = cartItems.map((item) => {
      const product = item.product_id;

      // Spread item and product details into one object
      return {
        _id: item._id,
        userId: item.userId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        ...product.toObject(), // Flatten product fields
      };
    });

    res.status(200).json({ cart });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch cart", error: err.message });
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid cart ID" });
    }

    const cart = await ShoppingCart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: "Cart update failed", error: err.message });
  }
};

// Delete Service
const deleteCart = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Cart ID" });
    }

    const cart = await ShoppingCart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Service deletion failed", error: err.message });
  }
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart,
};
