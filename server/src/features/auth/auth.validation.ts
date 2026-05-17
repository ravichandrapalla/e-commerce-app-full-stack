import { z } from "zod";
import { ROLES, type RoleName } from "../../constants/roles";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  accountType: z.enum(["buyer", "seller"]).default("buyer"),
});

export const accountTypeToRole = (accountType: "buyer" | "seller"): RoleName =>
  accountType === "seller" ? ROLES.SELLER : ROLES.BUYER;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});
