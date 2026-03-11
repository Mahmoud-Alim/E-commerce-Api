import { z } from 'zod';

export const createOrderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too high per item"),
});
