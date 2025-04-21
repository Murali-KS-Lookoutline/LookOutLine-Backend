const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

app.use(cookieParser());
//google integration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json()); // Parse JSON request bodies
const allowedOrigins = ["http://localhost:5173", "https://lookoutline.com"];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions)); // Enable CORS
app.use(helmet()); // Set security headers
app.use(morgan("combined")); // Log HTTP requests

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000, // 1 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/google", require("./routes/googleAuth"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
