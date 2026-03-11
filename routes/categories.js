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

import validateRequest from "../middlewares/validateRequest.js";
import { categorySchema, updateCategorySchema } from "../validations/categoryValidation.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", validateCategoryId, getCategoryById);

router.post("/", requireAdmin, validateRequest(categorySchema), createCategory);
router.put("/:id", requireAdmin, validateCategoryId, validateRequest(updateCategorySchema), updateCategory);
router.delete("/:id", requireAdmin, validateCategoryId, deleteCategory);

export default router;
