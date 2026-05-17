import { prisma } from "../../config/db";
import { CATALOG_CATEGORY_NAMES } from "../../constants/catalogCategories";

/** Categories aligned with ECOMMERCE_PRODUCT_IMAGES dataset folders */
export const DEFAULT_CATEGORIES = CATALOG_CATEGORY_NAMES;

export const ensureDefaultCategories = async () => {
  await Promise.all(
    DEFAULT_CATEGORIES.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
};
