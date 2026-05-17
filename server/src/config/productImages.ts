import path from "path";

/** Absolute path to train split used for catalog seeding and static serving */
export const PRODUCT_IMAGES_ROOT = path.resolve(
  process.cwd(),
  "..",
  "ECOMMERCE_PRODUCT_IMAGES",
  "train",
);

export const productImagePublicPath = (
  categorySlug: string,
  filename: string,
) => `/product-images/${categorySlug}/${filename}`;
