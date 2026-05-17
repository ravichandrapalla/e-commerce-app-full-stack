import { z } from "zod";

export const productQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
});

export const setQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(0),
});

