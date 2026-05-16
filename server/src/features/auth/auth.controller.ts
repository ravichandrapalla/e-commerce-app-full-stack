import { Response, Request } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { user } = await registerUser(parsed);
    // res.cookie("token", token, cookieOptions);
    if (user) res.status(201).json({ message: "User Registration Successful" });

    // res.json({ user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { user, token } = await loginUser(parsed);
    res.cookie("token", token, cookieOptions);
    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSelf = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  res.json({ user });
};

export const logout = (eq: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};
