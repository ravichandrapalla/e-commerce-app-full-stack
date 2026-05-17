import { z } from "zod";

export const shippingAddressSchema = z.object({
  name: z.string().min(2, "Enter the recipient name"),
  line1: z.string().min(3, "Enter street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  postalCode: z.string().min(3, "Enter postal code"),
  country: z.enum(["IN", "US"], { message: "Select a country" }),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;
