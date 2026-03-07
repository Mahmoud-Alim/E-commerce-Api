import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as categoryService from "../services/categoryService.js";

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return sendSuccess(res, 200, "Categories retrieved successfully", categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return sendSuccess(res, 200, "Category retrieved successfully", category);
});

// @desc    Create a new category (Admin only)
// @route   POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return sendSuccess(res, 201, "Category created successfully", category);
});

// @desc    Update a category (Admin only)
// @route   PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, 200, "Category updated successfully", category);
});

// @desc    Delete a category (Admin only)
// @route   DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  return sendSuccess(res, 200, "Category deleted successfully", category);
});
