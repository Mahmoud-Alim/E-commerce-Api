/**
 * Custom operational error class.
 * Thrown from service layer for known, expected errors (404, 400, 409, etc.)
 * The global error handler will identify these with `isOperational: true`
 * and send a structured response without leaking internal details.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
