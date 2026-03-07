import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import productRoutes from "./routes/product.js";
import categoriesRoutes from "./routes/categories.js";
import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/order.js";
import orderItemsRoutes from "./routes/orderitem.js";

// Middlewares & Utilities
import authJwt from "./helpers/jwt.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

// Load environment variables first — before anything else reads process.env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// CORS
// =============================================================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =============================================================================
// SECURITY MIDDLEWARES
// =============================================================================
app.use(helmet());                // Secure HTTP headers
app.use(mongoSanitize());         // Strip $ and . from req.body / req.query (NoSQL injection)
app.use(xss());                   // Sanitize request body against XSS
app.use(hpp());                   // Prevent HTTP Parameter Pollution

// =============================================================================
// COMPRESSION & BODY PARSERS
// =============================================================================
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// =============================================================================
// LOGGING
// =============================================================================
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// =============================================================================
// RATE LIMITING
// =============================================================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts. Please try again later." },
});

app.use("/api", globalLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// =============================================================================
// STATIC FILES
// =============================================================================
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

// =============================================================================
// JWT AUTHENTICATION
// =============================================================================
app.use(authJwt());

// =============================================================================
// HEALTH CHECK
// =============================================================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// =============================================================================
// API ROUTES
// =============================================================================
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderitems", orderItemsRoutes);

// =============================================================================
// 404 HANDLER
// =============================================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =============================================================================
// GLOBAL ERROR HANDLER (must be last)
// =============================================================================
app.use(errorHandler);

// =============================================================================
// DATABASE CONNECTION
// =============================================================================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

// =============================================================================
// SERVER
// =============================================================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    await mongoose.connection.close(false);
    logger.info("MongoDB connection closed.");
    process.exit(0);
  });
  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// =============================================================================
// UNHANDLED ERRORS — last safety net
// =============================================================================
process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

export default app;
