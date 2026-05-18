import { z } from "zod";

export const heroSlideFieldsSchema = z.object({
  eyebrow: z.string().min(1).max(80),
  title: z.string().min(2).max(120),
  description: z.string().min(5).max(300),
  cta: z.string().min(1).max(40),
  href: z.string().min(1).max(200),
  accent: z.string().min(5).max(120),
  isActive: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value === true || value === "true"),
});

export const reorderHeroSlidesSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});
