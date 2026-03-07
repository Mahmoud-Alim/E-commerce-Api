/**
 * Admin-only route guard.
 * Must be placed AFTER authJwt() in the middleware chain.
 * Reads the decoded JWT payload from req.auth (set by express-jwt).
 */
export const requireAdmin = (req, res, next) => {
  if (!req.auth?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required.",
    });
  }
  next();
};
