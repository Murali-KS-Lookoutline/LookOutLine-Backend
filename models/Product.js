const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  price: {
    cost_price: { type: Number },
    selling_price: { type: Number },
    currency: { type: String, default: "INR" },
  },
  stock: {
    quantity: { type: Number },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  supplier: {
    name: { type: String, required: true },
    contact: {
      phone: { type: String },
      email: { type: String },
      address: { type: String },
    },
  },
  images: [{ type: String }],
  dimensions: {
    weight: { value: { type: Number }, unit: { type: String, default: "g" } },
  },
  technical_specifications: {
    resolution: { type: String },
    video_compression: { type: String },
    min_illumination: {
      color: { type: String },
      bw: { type: String },
    },
    shutter_time: { type: String },
    day_night: { type: String },
    lens: {
      type: { type: String },
      options: [{ type: String }],
    },
    infrared: {
      distance: { type: String },
    },
    wdr: { type: String },
    dnr: { type: String },
    backlight_compensation: { type: Boolean },
    highlight_compensation: { type: Boolean },
    image_stabilization: { type: Boolean },
    regional_focus: { type: Boolean },
  },
  connectivity: {
    video_outputs: [{ type: String }],
    power_supply: { type: String },
    waterproof: { type: String },
  },
  general: {
    operating_conditions: {
      temperature: { type: String },
      humidity: { type: String },
    },
  },
  metadata: {
    date_added: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
  },
});

module.exports = mongoose.model("Product", productSchema);
