import { PRODUCT_IMAGE_FALLBACK } from "../constants/images";

/** Product images are Cloudinary HTTPS URLs saved at upload time. */
export const resolveProductImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return PRODUCT_IMAGE_FALLBACK;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return PRODUCT_IMAGE_FALLBACK;
};
