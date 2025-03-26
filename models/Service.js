const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  rating: { type: Number },
  reviews: { type: Number },
  price: { type: Number },
  serviceImage: { type: String },
  icon: { type: String },
  details: {
    services: [{ type: String }],
    issues: [
      {
        issue: { type: String },
        cause: { type: String },
        solution: { type: String },
      },
    ],
    reviewStats: [{ type: Number }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

serviceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

serviceSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Services", serviceSchema);
