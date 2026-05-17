import { PRODUCT_IMAGE_FALLBACK } from "../constants/images";

const apiOrigin = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export const resolveProductImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return PRODUCT_IMAGE_FALLBACK;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return `${apiOrigin}${imageUrl}`;
  return imageUrl;
};
