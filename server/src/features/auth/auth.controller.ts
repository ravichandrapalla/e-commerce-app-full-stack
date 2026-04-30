import { Response, Request } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { user, token } = await registerUser(parsed);
    res.cookie("token", token, cookieOptions);

    res.json({ user });
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

export const logout = (eq: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};
