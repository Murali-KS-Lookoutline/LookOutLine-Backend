const multer = require("multer");
const path = require("path");

// Define storage settings for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where files will be uploaded
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by combining current timestamp and original filename
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to ensure only image files are uploaded
const fileFilter = (req, file, cb) => {
  // Accept only image files (JPEG, PNG, GIF, etc.)
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // File is accepted
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject the file
  }
};

// Set up multer with the defined storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size: 10 MB
  },
}).array("images"); // Expecting 'images' field for multiple files

module.exports = upload;
