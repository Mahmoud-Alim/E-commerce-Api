import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validateCategoryId } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// --- Public read routes ---
router.get("/", getCategories);
router.get("/:id", validateCategoryId, getCategoryById);

// --- Admin-only write routes ---
router.post("/", requireAdmin, createCategory);
router.put("/:id", requireAdmin, validateCategoryId, updateCategory);
router.delete("/:id", requireAdmin, validateCategoryId, deleteCategory);

export default router;
