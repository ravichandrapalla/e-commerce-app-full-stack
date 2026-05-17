import { prisma } from "../../config/db";

export const DEFAULT_CATEGORIES = [
  "Electronics",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books & Stationery",
  "Toys & Games",
  "Grocery & Gourmet",
  "Health & Wellness",
  "Automotive",
  "Jewelry & Accessories",
  "Baby & Kids",
  "Pet Supplies",
  "Office Supplies",
  "Furniture",
] as const;

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
