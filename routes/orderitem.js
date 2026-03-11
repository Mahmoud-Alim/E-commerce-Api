import express from "express";
import { getOrderItems, createOrderItem } from "../controllers/orderitemController.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

import validateRequest from "../middlewares/validateRequest.js";
import { createOrderItemSchema } from "../validations/orderItemValidation.js";

const router = express.Router();

router.get("/", requireAdmin, getOrderItems);
router.post("/", requireAdmin, validateRequest(createOrderItemSchema), createOrderItem);

export default router;
