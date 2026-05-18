import type { Role } from "@prisma/client";
import { prisma } from "../../config/db";
import { normalizeRole, ROLES, type RoleName } from "../../constants/roles";
import { sendVerificationEmail } from "../email/email.service";
import { comparePasswod, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { publicUserSelect } from "../../utils/userSelect";
import {
  generateVerificationToken,
  verificationExpiryDate,
} from "../../utils/verificationToken";

type registerPayloadType = {
  name: string;
  email: string;
  password: string;
  role?: RoleName;
};

type loginPayloadType = {
  email: string;
  password: string;
};

export class AuthError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const registerUser = async (data: registerPayloadType) => {
  const email = normalizeEmail(data.email);
  const isExistingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (isExistingUser) {
    throw new AuthError("User already exists", "USER_EXISTS");
  }

  const hashedPassword = await hashPassword(data.password);
  const role = normalizeRole(data.role ?? ROLES.BUYER);

  if (role !== ROLES.BUYER && role !== ROLES.SELLER) {
    throw new AuthError(
      "Registration only supports buyer or seller accounts",
      "INVALID_ROLE",
    );
  }

  const verificationToken = generateVerificationToken();
  const emailVerificationExpires = verificationExpiryDate();

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role: role as Role,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires,
    },
    select: publicUserSelect,
  });

  try {
    await sendVerificationEmail({
      to: email,
      name: user.name,
      token: verificationToken,
    });
  } catch (error) {
    console.error("Failed to send verification email", error);
  }

  return { user };
};

export const loginUser = async (data: loginPayloadType) => {
  const email = normalizeEmail(data.email);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthError(
      "Are you sure you registered and entered valid credentials?",
      "INVALID_CREDENTIALS",
      401,
    );
  }

  const isValid = await comparePasswod(data.password, user.password);

  if (!isValid) {
    throw new AuthError("Invalid credentials", "INVALID_CREDENTIALS", 401);
  }

  if (!user.emailVerified && normalizeRole(user.role) !== ROLES.ADMIN) {
    throw new AuthError(
      "Please verify your email before signing in. Check your inbox for the verification link.",
      "EMAIL_NOT_VERIFIED",
      403,
    );
  }

  const token = signToken({ userId: user.id });

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: publicUserSelect,
  });

  return { user: safeUser!, token };
};

export const verifyEmail = async (token: string) => {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new AuthError("Verification token is required", "INVALID_TOKEN");
  }

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: trimmed,
      emailVerificationExpires: { gt: new Date() },
    },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AuthError(
      "This verification link is invalid or has expired.",
      "INVALID_TOKEN",
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
    select: publicUserSelect,
  });

  return updated;
};

export const resendVerificationEmail = async (emailInput: string) => {
  const email = normalizeEmail(emailInput);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "If that account exists, a verification email was sent." };
  }

  if (user.emailVerified) {
    throw new AuthError("Email is already verified", "ALREADY_VERIFIED");
  }

  const verificationToken = generateVerificationToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiryDate(),
    },
  });

  try {
    await sendVerificationEmail({
      to: email,
      name: user.name,
      token: verificationToken,
    });
  } catch (error) {
    console.error("Failed to resend verification email", error);
    throw new AuthError(
      "Could not send verification email. Try again later.",
      "EMAIL_SEND_FAILED",
      502,
    );
  }

  return { message: "If that account exists, a verification email was sent." };
};

type UpdateProfileInput = {
  name?: string;
  avatarUrl?: string;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: publicUserSelect,
  });
};
