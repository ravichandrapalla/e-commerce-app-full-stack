import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";
import { normalizeRole } from "../constants/roles";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ message: "User not Found" });
    }
    req.user = {
      id: user.id,
      role: normalizeRole(user.role),
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
