import { NextFunction, Response } from "express";
import { ROLES } from "../constants/roles";
import { prisma } from "../config/db";
import { AuthRequest } from "./auth.middleware";

export const requireEmailVerified = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === ROLES.ADMIN) {
    return next();
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { emailVerified: true },
  });

  if (!user?.emailVerified) {
    return res.status(403).json({
      message: "Please verify your email to access this feature.",
      code: "EMAIL_NOT_VERIFIED",
    });
  }

  next();
};
