import type { Express } from "express";
import {
  IMAGE_UPLOAD_ALLOWED_MIME_TYPES,
  IMAGE_UPLOAD_HINT,
  IMAGE_UPLOAD_MAX_BYTES,
} from "../constants/imageUpload";

export const validateImageFile = (
  file: Express.Multer.File | undefined,
  options: { required?: boolean } = {},
): string | null => {
  if (!file) {
    return options.required ? "Image is required" : null;
  }

  if (
    !IMAGE_UPLOAD_ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof IMAGE_UPLOAD_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return IMAGE_UPLOAD_HINT;
  }

  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return "Image must be under 5 MB";
  }

  return null;
};
