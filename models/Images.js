const mongoose = require("mongoose");

const uploadedImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Banner", "Logo", "Other"],
    required: true,
  },
  originalName: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

uploadedImageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

uploadedImageSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("UploadedImage", uploadedImageSchema);
