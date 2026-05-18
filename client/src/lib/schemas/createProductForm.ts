import { z } from "zod";
import { requiredImageFileSchema } from "../imageUploadValidation";

export const createProductFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  image: requiredImageFileSchema,
});

export type CreateProductFormValues = z.infer<typeof createProductFormSchema>;
export type CreateProductFormInput = z.input<typeof createProductFormSchema>;
