import express from "express";
import { getOrderItems, createOrderItem } from "../controllers/orderitemController.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", requireAdmin, getOrderItems);
router.post("/", requireAdmin, createOrderItem);

export default router;
