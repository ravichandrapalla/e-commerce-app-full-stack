export const ROLES = {
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  BUYER: "BUYER",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/** @deprecated DB value before multivendor migration */
const LEGACY_BUYER_ROLE = "CUSTOMER";

export const normalizeRole = (role: string): RoleName => {
  if (role === LEGACY_BUYER_ROLE) return ROLES.BUYER;
  if (role === ROLES.ADMIN || role === ROLES.SELLER || role === ROLES.BUYER) {
    return role;
  }
  return ROLES.BUYER;
};

export const isBuyer = (role: string) =>
  normalizeRole(role) === ROLES.BUYER;
export const isSeller = (role: string) =>
  normalizeRole(role) === ROLES.SELLER;
export const isAdmin = (role: string) =>
  normalizeRole(role) === ROLES.ADMIN;
export const canManageCatalog = (role: string) =>
  role === ROLES.ADMIN || role === ROLES.SELLER;
