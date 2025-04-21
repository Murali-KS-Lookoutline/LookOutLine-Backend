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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//app might accept HTML form submissions
app.use(express.urlencoded({ extended: true }));

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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan("combined")); // Log HTTP requests

//for compression
const compression = require("compression");
app.use(compression());

// Create different limiters
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_WINDOW) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  handler: function (req, res) {
    console.warn(`Rate limit hit for IP: ${req.ip}`);
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // stricter
  message: "Too many login attempts, please try again later.",
});

app.set("trust proxy", 1);

// Routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/google", generalLimiter, require("./routes/googleAuth"));
app.use("/api/products", generalLimiter, require("./routes/productRoutes"));
app.use("/api/users", generalLimiter, require("./routes/userRoutes"));
app.use("/api/services", generalLimiter, require("./routes/serviceRoutes"));

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
