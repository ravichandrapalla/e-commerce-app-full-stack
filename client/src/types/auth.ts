export const ROLES = {
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  BUYER: "BUYER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  emailVerified: boolean;
};

/** @deprecated Pre-migration API/DB value */
const LEGACY_BUYER_ROLE = "CUSTOMER";

export const normalizeRole = (role: string): UserRole => {
  if (role === LEGACY_BUYER_ROLE) return ROLES.BUYER;
  if (role === ROLES.ADMIN || role === ROLES.SELLER || role === ROLES.BUYER) {
    return role;
  }
  return ROLES.BUYER;
};

export const isBuyer = (role: string) => normalizeRole(role) === ROLES.BUYER;
export const isSeller = (role: string) => normalizeRole(role) === ROLES.SELLER;
export const isAdmin = (role: string) => normalizeRole(role) === ROLES.ADMIN;

export const toAuthUser = (user: AuthUser): AuthUser => ({
  ...user,
  role: normalizeRole(user.role),
  emailVerified: user.emailVerified ?? false,
});
