import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { normalizeRole } from "../constants/roles";

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = normalizeRole(req.user.role);
    if (!roles.some((role) => normalizeRole(role) === userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
