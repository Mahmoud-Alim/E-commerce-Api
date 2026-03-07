import User from "../models/users.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

// --- Read ---

export const getAllUsers = async () => {
  return User.find().select("-passwordHash");
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-passwordHash");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const getUserCount = async () => {
  return User.countDocuments();
};

// --- Auth ---

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  // Use a generic message to prevent user enumeration attacks
  if (!user) throw new AppError("Invalid email or password", 401);

  const isValid = await argon2.verify(user.passwordHash, password);
  if (!isValid) throw new AppError("Invalid email or password", 401);

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Strip the hash before returning
  const userObj = user.toJSON();
  delete userObj.passwordHash;
  return { user: userObj, token };
};

export const registerUser = async (data) => {
  const { name, email, password, phone, street, apartment, zip, city, country } = data;
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new AppError("Email is already registered", 409);

  const passwordHash = await argon2.hash(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    isAdmin: false, // Registrations are NEVER admin
    street,
    apartment,
    zip,
    city,
    country,
  });

  const userObj = user.toJSON();
  delete userObj.passwordHash;
  return userObj;
};

// --- Write (Admin) ---

export const createUser = async (data) => {
  const { name, email, password, phone, isAdmin, street, apartment, zip, city, country } = data;
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new AppError("Email is already registered", 409);

  const passwordHash = await argon2.hash(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    isAdmin: isAdmin ?? false,
    street,
    apartment,
    zip,
    city,
    country,
  });

  const userObj = user.toJSON();
  delete userObj.passwordHash;
  return userObj;
};

export const updateUser = async (id, data) => {
  const { password, isAdmin, ...rest } = data;
  const updateData = { ...rest };

  if (password) {
    updateData.passwordHash = await argon2.hash(password);
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id).select("-passwordHash");
  if (!user) throw new AppError("User not found", 404);
  return user;
};
