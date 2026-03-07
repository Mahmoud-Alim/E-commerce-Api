import mongoose from "mongoose";
import Category from "../models/categories.js";
import asyncHandler from "express-async-handler";
import { sendError } from "../utils/apiResponse.js";

export const validateProductId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return sendError(res, 400, "Invalid Product ID");
  }
  next();
};

export const validateUserId = (req, res, next) => {
  const id = req.params.id || req.params.userId;
  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, 400, "Invalid User ID");
  }
  next();
};

export const validateCategoryId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return sendError(res, 400, "Invalid Category ID");
  }
  next();
};

export const validateOrderId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return sendError(res, 400, "Invalid Order ID");
  }
  next();
};

export const validateCategoryExists = asyncHandler(async (req, res, next) => {
  const { category } = req.body;
  if (!category) return next();

  if (!mongoose.isValidObjectId(category)) {
    return sendError(res, 400, "Invalid Category ID in body");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return sendError(res, 400, "Category does not exist");
  }
  next();
});
