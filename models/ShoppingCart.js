const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
