import { z } from "zod";

export const shippingAddressSchema = z.object({
  name: z.string().min(2).max(80),
  line1: z.string().min(3).max(120),
  line2: z.string().max(120).optional(),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  postalCode: z.string().min(3).max(20),
  country: z.string().length(2),
});

export const checkoutSchema = z.object({
  shipping: shippingAddressSchema,
});
