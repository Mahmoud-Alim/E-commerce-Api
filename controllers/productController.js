import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as productService from "../services/productService.js";

// @desc    Get all products (optionally filtered by category)
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req.query.category);
  return sendSuccess(res, 200, "Products retrieved successfully", products);
});

// @desc    Get total product count
// @route   GET /api/products/get/count
export const getProductCount = asyncHandler(async (req, res) => {
  const productCount = await productService.getProductCount();
  return sendSuccess(res, 200, "Product count retrieved successfully", { productCount });
});

// @desc    Get featured products
// @route   GET /api/products/get/featured/:count?
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.params.count);
  return sendSuccess(res, 200, "Featured products retrieved successfully", products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return sendSuccess(res, 200, "Product retrieved successfully", product);
});

// @desc    Create a new product (Admin only)
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files);
  return sendSuccess(res, 201, "Product created successfully", product);
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files);
  return sendSuccess(res, 200, "Product updated successfully", product);
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  return sendSuccess(res, 200, "Product deleted successfully", result);
});
