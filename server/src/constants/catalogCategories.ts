/** Folder slugs under ECOMMERCE_PRODUCT_IMAGES/{train|val|check}/ */
export const CATALOG_CATEGORY_SLUGS = [
  "BABY_PRODUCTS",
  "BEAUTY_HEALTH",
  "CLOTHING_ACCESSORIES_JEWELLERY",
  "ELECTRONICS",
  "GROCERY",
  "HOBBY_ARTS_STATIONERY",
  "HOME_KITCHEN_TOOLS",
  "PET_SUPPLIES",
  "SPORTS_OUTDOOR",
] as const;

export type CatalogCategorySlug = (typeof CATALOG_CATEGORY_SLUGS)[number];

/** Display names stored in Category.name and shown in the UI */
export const CATALOG_CATEGORY_LABELS: Record<CatalogCategorySlug, string> = {
  BABY_PRODUCTS: "Baby Products",
  BEAUTY_HEALTH: "Beauty & Health",
  CLOTHING_ACCESSORIES_JEWELLERY: "Clothing & Accessories",
  ELECTRONICS: "Electronics",
  GROCERY: "Grocery",
  HOBBY_ARTS_STATIONERY: "Hobby & Stationery",
  HOME_KITCHEN_TOOLS: "Home & Kitchen",
  PET_SUPPLIES: "Pet Supplies",
  SPORTS_OUTDOOR: "Sports & Outdoor",
};

export const CATALOG_CATEGORY_NAMES = CATALOG_CATEGORY_SLUGS.map(
  (slug) => CATALOG_CATEGORY_LABELS[slug],
);

/** Map DB category name back to image folder slug */
export const categoryNameToSlug = (name: string): CatalogCategorySlug | null => {
  const entry = CATALOG_CATEGORY_SLUGS.find(
    (slug) => CATALOG_CATEGORY_LABELS[slug] === name,
  );
  return entry ?? null;
};
