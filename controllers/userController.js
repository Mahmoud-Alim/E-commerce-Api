import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return sendSuccess(res, 200, "Users retrieved successfully", users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, 200, "User retrieved successfully", user);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return sendSuccess(res, 201, "User created successfully", user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return sendSuccess(res, 200, "User updated successfully", user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return sendSuccess(res, 200, "User deleted successfully", result);
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await userService.loginUser(email, password);

  // Set JWT in HttpOnly, Secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  });

  return sendSuccess(res, 200, "User logged in successfully", { user });
});

export const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req.body);
  return sendSuccess(res, 201, "User registered successfully", user);
});

export const getUserCount = asyncHandler(async (req, res) => {
  const userCount = await userService.getUserCount();
  return sendSuccess(res, 200, "User count retrieved successfully", { userCount });
});
