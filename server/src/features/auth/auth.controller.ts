import { Response, Request } from "express";
import {
  accountTypeToRole,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "./auth.validation";
import {
  AuthError,
  loginUser,
  registerUser,
  resendVerificationEmail,
  updateUserProfile,
  verifyEmail,
} from "./auth.service";
import { updateProfileSchema } from "./auth.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";
import { publicUserSelect } from "../../utils/userSelect";
import { uploadImage } from "../../utils/uploadImage";
import { validateImageFile } from "../../utils/validateImageFile";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
};

const handleAuthError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    return res.status(error.status).json({
      message: error.message,
      code: error.code,
    });
  }

  const message = error instanceof Error ? error.message : "Request failed";
  return res.status(400).json({ message });
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    await registerUser({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      role: accountTypeToRole(parsed.accountType),
    });

    res.status(201).json({
      message:
        "Account created. Check your email for a verification link before signing in.",
    });
  } catch (error: unknown) {
    handleAuthError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { user, token } = await loginUser(parsed);
    res.cookie("token", token, cookieOptions);
    res.json({ user });
  } catch (error: unknown) {
    handleAuthError(error, res);
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  try {
    const parsed = verifyEmailSchema.parse(req.query);
    const user = await verifyEmail(parsed.token);
    res.json({
      user,
      message: "Email verified. You can sign in now.",
    });
  } catch (error: unknown) {
    handleAuthError(error, res);
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const parsed = resendVerificationSchema.parse(req.body);
    const result = await resendVerificationEmail(parsed.email);
    res.json(result);
  } catch (error: unknown) {
    handleAuthError(error, res);
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
      const avatarValidationError = validateImageFile(req.file);
      if (avatarValidationError) {
        return res.status(400).json({ message: avatarValidationError });
      }

      const uploaded: { secure_url?: string } = (await uploadImage(
        req.file.buffer,
        { folder: "ecommerce/avatars", preset: "avatar" },
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

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};
