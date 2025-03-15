const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
