const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  price: z.number().positive('Price must be positive'),
  description: z.string().max(500).optional(),
  category: z.enum(['electronics', 'clothing', 'books', 'other']),
  stock: z.number().int().min(0).default(0)
});

const updateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  price: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['electronics', 'clothing', 'books', 'other']).optional(),
  stock: z.number().int().min(0).optional()
});

module.exports = { createProductSchema, updateProductSchema };