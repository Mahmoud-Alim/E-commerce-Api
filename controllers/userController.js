import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";

// @desc    Get all users (Admin only)
// @route   GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return sendSuccess(res, 200, "Users retrieved successfully", users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, 200, "User retrieved successfully", user);
});

// @desc    Create a new user (Admin only)
// @route   POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return sendSuccess(res, 201, "User created successfully", user);
});

// @desc    Update a user
// @route   PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return sendSuccess(res, 200, "User updated successfully", user);
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return sendSuccess(res, 200, "User deleted successfully", result);
});

// @desc    User login
// @route   POST /api/users/login
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  return sendSuccess(res, 200, "User logged in successfully", result);
});

// @desc    User registration
// @route   POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req.body);
  return sendSuccess(res, 201, "User registered successfully", user);
});

// @desc    Get user count (Admin only)
// @route   GET /api/users/get/count
export const getUserCount = asyncHandler(async (req, res) => {
  const userCount = await userService.getUserCount();
  return sendSuccess(res, 200, "User count retrieved successfully", { userCount });
});
