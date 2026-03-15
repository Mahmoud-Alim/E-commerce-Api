import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name too long").trim(),
  email: z.string().email("Invalid email format").max(100, "Email too long").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password too long"),
  phone: z.string().max(20, "Phone number too long").optional(),
  street: z.string().max(100, "Street address too long").default(""),
  apartment: z.string().max(50, "Apartment info too long").default(""),
  zip: z.string().max(10, "Zip code too long").default(""),
  city: z.string().max(50, "City too long").default(""),
  country: z.string().max(50, "Country too long").default(""),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(100).toLowerCase().trim(),
  password: z.string().min(1, "Password is required").max(100),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name too long").optional(),
  email: z.string().email("Invalid email format").max(100, "Email too long").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password too long").optional(),
  phone: z.string().max(20, "Phone number too long").optional(),
  street: z.string().max(100, "Street address too long").optional(),
  apartment: z.string().max(50, "Apartment info too long").optional(),
  zip: z.string().max(10, "Zip code too long").optional(),
  city: z.string().max(50, "City too long").optional(),
  country: z.string().max(50, "Country too long").optional(),
  isAdmin: z.boolean().optional(),
});
