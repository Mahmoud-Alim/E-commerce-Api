import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as productService from "../services/productService.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req.query.category);
  return sendSuccess(res, 200, "Products retrieved successfully", products);
});

export const getProductCount = asyncHandler(async (req, res) => {
  const productCount = await productService.getProductCount();
  return sendSuccess(res, 200, "Product count retrieved successfully", { productCount });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.params.count);
  return sendSuccess(res, 200, "Featured products retrieved successfully", products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return sendSuccess(res, 200, "Product retrieved successfully", product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files);
  return sendSuccess(res, 201, "Product created successfully", product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files);
  return sendSuccess(res, 200, "Product updated successfully", product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  return sendSuccess(res, 200, "Product deleted successfully", result);
});
