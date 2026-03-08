import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
} from "../controllers/orderController.js";
import { validateOrderId, validateUserId } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { orderSchema, updateOrderStatusSchema } from "../validations/orderValidation.js";

const router = express.Router();

router.get("/", requireAdmin, getOrders);
router.get("/get/total-sales", requireAdmin, getTotalSales);
router.get("/get/count", requireAdmin, getOrderCount);
router.put("/:id", requireAdmin, validateOrderId, validateRequest(updateOrderStatusSchema), updateOrder);
router.delete("/:id", requireAdmin, validateOrderId, deleteOrder);

router.get("/get/user-orders/:userId", validateUserId, getUserOrders);
router.get("/:id", validateOrderId, getOrderById);
router.post("/", validateRequest(orderSchema), createOrder);

export default router;
