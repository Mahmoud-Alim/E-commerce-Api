import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID in orderItems"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too high per item"),
});

export const orderSchema = z.object({
  orderItems: z.array(orderItemSchema).nonempty("orderItems must be a non-empty array").max(50, "Too many items in one order"),
  shippingAddress1: z.string().min(5, "Shipping address is too short").max(100, "Address too long").trim(),
  shippingAddress2: z.string().max(100, "Address too long").trim().default(""),
  city: z.string().min(2, "City is required").max(50, "City name too long").trim(),
  zip: z.string().min(2, "Zip code is required").max(10, "Zip code too long").trim(),
  country: z.string().min(2, "Country is required").max(50, "Country name too long").trim(),
  phone: z.string().min(5, "Phone number is required").max(20, "Phone number too long").trim(),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional().default('Pending'),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format").optional(), // Usually taken from req.auth
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
});
