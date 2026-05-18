import { NextFunction, Request, Response } from "express";
import {
  uploadAvatar,
  uploadHeroImage,
  uploadHeroImages,
  uploadProductImage,
} from "./upload.middleware";
import { handleMulterError } from "./multerError.middleware";

const runUpload =
  (
    upload: (
      req: Request,
      res: Response,
      callback: (error: unknown) => void,
    ) => void,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  };

export const runProductImageUpload = runUpload(uploadProductImage);
export const runAvatarUpload = runUpload(uploadAvatar);
export const runHeroImageUpload = runUpload(uploadHeroImage);
export const runHeroImagesUpload = runUpload(uploadHeroImages);
