import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long").trim(),
  richDescription: z.string().trim().default(""),
  brand: z.string().trim().default(""),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format (must be 24-char hex)"),
  countInStock: z.coerce.number().int().min(0).max(10000),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export const updateProductSchema = productSchema.partial();
