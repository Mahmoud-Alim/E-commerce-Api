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
    requestProperty: "auth",
  }).unless({
    path: [
      "/api/users/login",
      "/api/users/register",
      { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      "/health",
    ],
  });
}

export default authJwt;
