import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import {
  IMAGE_UPLOAD_ALLOWED_MIME_TYPES,
  IMAGE_UPLOAD_MAX_BYTES,
} from "../constants/imageUpload";

const storage = multer.memoryStorage();

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (
    IMAGE_UPLOAD_ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof IMAGE_UPLOAD_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    callback(null, true);
    return;
  }

  callback(new Error("Only JPG, PNG, and WebP images are allowed"));
};

const imageUpload = multer({
  storage,
  limits: { fileSize: IMAGE_UPLOAD_MAX_BYTES },
  fileFilter: imageFileFilter,
});

export const uploadProductImage = imageUpload.single("image");
export const uploadAvatar = imageUpload.single("avatar");
export const uploadHeroImages = imageUpload.array("images", 8);
export const uploadHeroImage = imageUpload.single("image");

/** @deprecated Use uploadProductImage or uploadAvatar */
export const upload = imageUpload;
