import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const handleMulterError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be under 5 MB"
        : err.message;
    return res.status(400).json({ message });
  }

  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }

  next(err);
};
