import express from "express";
import {
  getProducts,
  getProductCount,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validateProductId, validateCategoryExists } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { productSchema, updateProductSchema } from "../validations/productValidation.js";

const router = express.Router();

// --- Public read routes ---
router.get("/", getProducts);
router.get("/get/count", getProductCount);
router.get("/get/featured/:count?", getFeaturedProducts);
router.get("/:id", validateProductId, getProductById);

// --- Admin-only write routes ---
router.post(
  "/",
  requireAdmin,
  upload.array("images", 10),
  validateRequest(productSchema),
  validateCategoryExists,
  createProduct
);
router.put(
  "/:id",
  requireAdmin,
  validateProductId,
  upload.array("images", 10),
  validateRequest(updateProductSchema),
  validateCategoryExists,
  updateProduct
);
router.delete("/:id", requireAdmin, validateProductId, deleteProduct);

export default router;
