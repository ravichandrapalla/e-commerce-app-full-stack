import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string(),
  imageUrl: z.string().optional(),
});

export const querySchema = z.object({
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
