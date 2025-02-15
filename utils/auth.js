const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

/**
 * Generate a JWT token for a user
 * @param {string} userId - The ID of the user
 * @param {string} role - The role of the user (admin, customer, vendor)
 * @returns {string} - The generated JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // Token expires in 1 day by default
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object} - The decoded token payload (contains user ID and role)
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
