import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)").max(100, "Name too long").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long").max(1000, "Description too long").trim(),
  richDescription: z.string().max(5000, "Rich description too long").trim().default(""),
  brand: z.string().max(50, "Brand name too long").trim().default(""),
  price: z.coerce.number().min(0, "Price must be a positive number").max(1000000, "Price too high"),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format (must be 24-char hex)"),
  countInStock: z.coerce.number().int().min(0).max(10000),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export const updateProductSchema = productSchema.partial();
