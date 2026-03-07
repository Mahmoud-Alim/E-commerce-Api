import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  registerUser,
  getUserCount,
} from "../controllers/userController.js";
import { validateUserId } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validations/userValidation.js";

const router = express.Router();

// --- Public routes (no token required, handled by jwt.unless) ---
router.post("/login", validateRequest(loginSchema), userLogin);
router.post("/register", validateRequest(registerSchema), registerUser);

// --- Admin-only routes ---
router.get("/", requireAdmin, getUsers);
router.post("/", requireAdmin, validateRequest(registerSchema), createUser);
router.get("/get/count", requireAdmin, getUserCount);

// --- Authenticated user routes ---
router.get("/:id", validateUserId, getUserById);
router.put("/:id", validateUserId, validateRequest(updateUserSchema), updateUser);
router.delete("/:id", requireAdmin, validateUserId, deleteUser);

export default router;
