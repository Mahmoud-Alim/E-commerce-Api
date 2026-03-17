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
import cookieParser from "cookie-parser";
import session from "express-session";
import csrf from "tiny-csrf";

import productRoutes from "./routes/product.js";
import categoriesRoutes from "./routes/categories.js";
import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/order.js";
import orderItemsRoutes from "./routes/orderitem.js";

import authJwt from "./helpers/jwt.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

dotenv.config();
const apiPath = "/api/v1";
const app = express();
app.set("trust proxy", 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
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

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET || "default-cookie-secret"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

const csrfSecret = process.env.CSRF_SECRET || "csrf-secret-change-in-production-long-secret";

// Middleware to ensure CSRF token is only accepted from the header
app.use((req, res, next) => {
  // Clear any CSRF token in body or query to force header-only verification
  if (req.body && req.body._csrf) delete req.body._csrf;
  if (req.query && req.query._csrf) delete req.query._csrf;
  
  // If the header exists, move it to req.body._csrf for tiny-csrf to find it
  if (req.headers["x-csrf-token"]) {
    req.body = req.body || {};
    req.body._csrf = req.headers["x-csrf-token"];
  }
  next();
});

app.use(csrf(csrfSecret));

// CSRF Token endpoint
app.get(`${apiPath}/csrf-token`, (req, res) => {
  res.status(200).json({
    success: true,
    csrfToken: req.csrfToken(),
  });
});

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development",
  message: {
    success: false,
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development",
  message: {
    success: false,
    status: 429,
    message: "Too many auth attempts. Please try again later.",
  },
});

app.use(`${apiPath}`, globalLimiter);
app.use(`${apiPath}/users/login`, authLimiter);
app.use(`${apiPath}/users/register`, authLimiter);

app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.get(`${apiPath}/home`, (req, res) => {
  res.status(200).json({
    message: "hello",
    success: true,
  });
});

app.use(authJwt());

app.get(`${apiPath}/health`, (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use(`${apiPath}/products`, productRoutes);
app.use(`${apiPath}/categories`, categoriesRoutes);
app.use(`${apiPath}/users`, usersRoutes);
app.use(`${apiPath}/orders`, ordersRoutes);
app.use(`${apiPath}/orderitems`, orderItemsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;
