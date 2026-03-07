import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID in orderItems"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const orderSchema = z.object({
  orderItems: z.array(orderItemSchema).nonempty("orderItems must be a non-empty array"),
  shippingAddress1: z.string().min(5, "Shipping address is too short").trim(),
  shippingAddress2: z.string().trim().default(""),
  city: z.string().min(2, "City is required").trim(),
  zip: z.string().min(2, "Zip code is required").trim(),
  country: z.string().min(2, "Country is required").trim(),
  phone: z.string().min(5, "Phone number is required").trim(),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional().default('Pending'),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format").optional(), // Usually taken from req.auth
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
});
