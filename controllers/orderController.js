import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderService from "../services/orderService.js";

// @desc    Get all orders with pagination (Admin only)
// @route   GET /api/orders?page=1&limit=20
export const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  return sendSuccess(res, 200, "Orders retrieved successfully", result);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  return sendSuccess(res, 200, "Order retrieved successfully", order);
});

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  // req.auth.userId comes from the verified JWT — never from req.body
  const order = await orderService.createOrder(req.body, req.auth.userId);
  return sendSuccess(res, 201, "Order created successfully", order);
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Order updated successfully", order);
});

// @desc    Delete an order (Admin only)
// @route   DELETE /api/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  return sendSuccess(res, 200, "Order deleted successfully", result);
});

// @desc    Get total sales (Admin only)
// @route   GET /api/orders/get/total-sales
export const getTotalSales = asyncHandler(async (req, res) => {
  const totalSales = await orderService.getTotalSales();
  return sendSuccess(res, 200, "Total sales retrieved successfully", totalSales);
});

// @desc    Get order count (Admin only)
// @route   GET /api/orders/get/count
export const getOrderCount = asyncHandler(async (req, res) => {
  const count = await orderService.getOrderCount();
  return sendSuccess(res, 200, "Order count retrieved successfully", count);
});

// @desc    Get orders for a specific user
// @route   GET /api/orders/get/user-orders/:userId
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.params.userId);
  return sendSuccess(res, 200, "User orders retrieved successfully", orders);
});
