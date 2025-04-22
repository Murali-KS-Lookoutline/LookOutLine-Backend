const UploadedImage = require("../models/Images");
const mongoose = require("mongoose");

// Upload/Create Image
const createImage = async (req, res) => {
  try {
    const files = req.files; // Assuming multer is used
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedImages = await Promise.all(
      files.map((file) =>
        UploadedImage.create({
          imageUrl: file.path,
          originalName: file.originalname,
          category,
        })
      )
    );

    res.status(201).json({ images: uploadedImages });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Image upload failed", error: err.message });
  }
};

// Get Images by Category (or all)
const getImages = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const images = await UploadedImage.find(filter).sort({ uploadedAt: -1 });

    res.status(200).json({ images });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch images", error: err.message });
  }
};

// Delete Image by ID
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const image = await UploadedImage.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete image", error: err.message });
  }
};

module.exports = {
  createImage,
  getImages,
  deleteImage,
};
