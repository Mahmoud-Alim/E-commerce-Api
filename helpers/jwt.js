import { expressjwt } from "express-jwt";

/**
 * JWT authentication middleware.
 * Validates the Bearer token on protected routes.
 * On success, the decoded payload is available as req.auth.
 * Route-level admin enforcement is handled separately by adminMiddleware.js.
 */
function authJwt() {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth", // decoded payload → req.auth
  }).unless({
    path: [
      // Auth endpoints — no token required
      "/api/users/login",
      "/api/users/register",
      // Public read access for products and categories
      { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      // Health check
      "/health",
    ],
  });
}

export default authJwt;
