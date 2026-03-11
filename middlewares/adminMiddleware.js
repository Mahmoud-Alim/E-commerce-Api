import { deleteFiles } from "./uploadMiddleware.js";

/**
 * Admin-only route guard middleware.
 * Must be placed AFTER authJwt() in the middleware chain.
 * Reads the decoded JWT payload from req.auth (set by express-jwt).
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.auth?.isAdmin) {
    // If files were already uploaded by multer before this check, clean them up
    if (req.files) {
      await deleteFiles(req.files);
    } else if (req.file) {
      await deleteFiles([req.file]);
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required.",
    });
  }
  next();
};
