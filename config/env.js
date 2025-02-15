require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "15m",
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REFRESH_EXPIRATION: process.env.REFRESH_EXPIRATION || "7d",
};
