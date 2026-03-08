import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderItemService from "../services/orderItemService.js";

export const getOrderItems = asyncHandler(async (req, res) => {
  const items = await orderItemService.getAllOrderItems();
  return sendSuccess(res, 200, "Order items retrieved successfully", items);
});

export const createOrderItem = asyncHandler(async (req, res) => {
  const item = await orderItemService.createOrderItem(req.body);
  return sendSuccess(res, 201, "Order item created successfully", item);
});
