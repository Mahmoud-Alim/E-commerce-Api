import { sendError } from "../utils/apiResponse.js";
import logger from "../utils/logger.js";

/**
 * Global error handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - AppError (operational, thrown from service layer)
 *  - MongoDB duplicate key (E11000)
 *  - Mongoose ValidationError
 *  - express-jwt UnauthorizedError
 *  - Multer upload errors
 *  - Unknown/programmer errors (never leak in production)
 */
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] ?? "field";
    return sendError(res, 409, `${field} is already in use.`);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return sendError(res, 400, "Validation Error", messages);
  }

  if (err.name === "MulterError") {
    return sendError(res, 400, "File upload error", err.message);
  }

  if (err.name === "UnauthorizedError") {
    return sendError(res, 401, "Unauthorized", "Invalid or missing authentication token.");
  }

  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message);
  }

  const isProduction = process.env.NODE_ENV === "production";
  return sendError(
    res,
    500,
    isProduction ? "Internal Server Error" : err.message,
    isProduction ? undefined : err.stack
  );
};

export default errorHandler;
