import { Response, Request } from "express";
import {
  accountTypeToRole,
  loginSchema,
  registerSchema,
} from "./auth.validation";
import { loginUser, registerUser, updateUserProfile } from "./auth.service";
import { updateProfileSchema } from "./auth.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";
import { publicUserSelect } from "../../utils/userSelect";
import { uploadImage } from "../../utils/uploadImage";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { user } = await registerUser({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      role: accountTypeToRole(parsed.accountType),
    });
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
    select: publicUserSelect,
  });
  res.json({ user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    let avatarUrl: string | undefined;

    if (req.file) {
      const uploaded: { secure_url?: string } = (await uploadImage(
        req.file.buffer,
        { folder: "ecommerce/avatars" },
      )) as { secure_url?: string };
      avatarUrl = uploaded.secure_url;
    }

    const profileData: { name?: string; avatarUrl?: string } = {};
    if (parsed.name !== undefined) profileData.name = parsed.name;
    if (avatarUrl) profileData.avatarUrl = avatarUrl;

    const user = await updateUserProfile(req.user!.id, profileData);

    res.json({ user });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Profile update failed";
    res.status(400).json({ message });
  }
};

export const logout = (eq: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};
