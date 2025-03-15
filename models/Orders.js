const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  orderItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalAmt: {
    type: Number,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Orders", ordersSchema);
