import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters long").max(50, "Name too long").trim(),
  color: z.string().max(20, "Color string too long").default(""),
  icon: z.string().max(50, "Icon name too long").default(""),
});

export const updateCategorySchema = categorySchema.partial();
