import Category from "../models/categories.js";
import AppError from "../utils/AppError.js";

// --- Read ---

export const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

// --- Write ---

export const createCategory = async ({ name, icon, color }) => {
  if (!name) throw new AppError("Category name is required", 400);
  const category = await Category.create({ name, icon, color });
  return category;
};

export const updateCategory = async (id, { name, icon, color }) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { name, icon, color },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found", 404);
  return category;
};
