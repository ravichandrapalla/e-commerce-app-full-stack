import { z } from "zod";

export const IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export const IMAGE_UPLOAD_ACCEPT = "image/jpeg,image/png,image/webp";

export const IMAGE_UPLOAD_HINT =
  "JPG, PNG, or WebP up to 5 MB. Saved as optimized WebP.";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return IMAGE_UPLOAD_HINT;
  }

  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return "Image must be under 5 MB";
  }

  return null;
};

export const requiredImageFileSchema = z
  .instanceof(FileList)
  .refine((files) => files.length > 0, "Product image is required")
  .refine(
    (files) => validateImageFile(files[0]!) === null,
    { message: IMAGE_UPLOAD_HINT },
  );

