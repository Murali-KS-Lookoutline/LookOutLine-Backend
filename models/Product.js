const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  shortDescription: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  price: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  productCategory: { type: String },
  channels: { type: String },
  cameraType: { type: String },
  megapixel: { type: String },
  audio: { type: String },
  smpsChannels: { type: String },
  poeChannels: { type: String },
  storageType: { type: String },
  storageCapacity: { type: String },
  keySpecs: { type: String },
  supplier: {
    name: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
      address: { type: String },
    },
  },
  imageUrls: [{ type: String }],
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
  },
});

module.exports = mongoose.model("Product", productSchema);
