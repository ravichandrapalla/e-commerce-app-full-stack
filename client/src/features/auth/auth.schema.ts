import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  accountType: z.enum(["buyer", "seller"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type registrationType = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
