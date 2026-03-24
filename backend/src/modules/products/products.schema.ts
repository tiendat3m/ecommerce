import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const productFilterSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    featured: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'name']).optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];