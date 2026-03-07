import OrderItem from "../models/order-item.js";
import AppError from "../utils/AppError.js";

export const getAllOrderItems = async () => {
  const items = await OrderItem.find().populate("product");
  return items;
};

export const createOrderItem = async ({ quantity, product }) => {
  if (!quantity || !product) {
    throw new AppError("quantity and product are required", 400);
  }
  const item = await OrderItem.create({ quantity, product });
  return item;
};
