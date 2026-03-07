import Order from "../models/order.js";
import OrderItem from "../models/order-item.js";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

// --- Read ---

export const getAllOrders = async ({ page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find()
      .select("status totalPrice dateOrdered user phone")
      .populate("user", "name email")
      .sort({ dateOrdered: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(),
  ]);

  return {
    orders,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const getTotalSales = async () => {
  const result = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!result.length) throw new AppError("No sales data found", 404);
  return result[0].totalSales;
};

export const getOrderCount = async () => {
  return Order.countDocuments();
};

export const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!orders.length) throw new AppError("No orders found for this user", 404);
  return orders;
};

// --- Write ---

export const createOrder = async (orderData, userId) => {
  const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status } = orderData;

  // Input validation
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new AppError("orderItems must be a non-empty array", 400);
  }
  if (!shippingAddress1 || !city || !zip || !country || !phone) {
    throw new AppError("Missing required shipping fields: shippingAddress1, city, zip, country, phone", 400);
  }

  // Single DB query to fetch all product prices — avoids the N+1 problem
  const productIds = orderItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select("price");
  const priceMap = Object.fromEntries(products.map((p) => [p._id.toString(), p.price]));

  // Calculate total price server-side (never trust client-sent prices)
  const totalPrice = orderItems.reduce((sum, item) => {
    const price = priceMap[item.product] ?? 0;
    return sum + price * item.quantity;
  }, 0);

  // Save all OrderItems in parallel
  const savedItems = await Promise.all(
    orderItems.map((item) =>
      OrderItem.create({ quantity: item.quantity, product: item.product })
    )
  );
  const orderItemsIds = savedItems.map((i) => i._id);

  // user always comes from the verified JWT, never from req.body (IDOR fix)
  const order = await Order.create({
    orderItems: orderItemsIds,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status: status || "Pending",
    totalPrice,
    user: userId,
  });

  return order;
};

export const updateOrder = async (id, status) => {
  if (!status) throw new AppError("Order status is required", 400);
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new AppError("Order not found", 404);
  return order;
};
