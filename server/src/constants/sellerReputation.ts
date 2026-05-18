/** Sellers at or above this score can have pending listings bulk-approved by admin */
export const SELLER_REPUTATION_BULK_APPROVE_THRESHOLD = 70;

export const SELLER_REPUTATION_ON_APPROVE = 5;
export const SELLER_REPUTATION_ON_REJECT = -8;

export const clampReputation = (value: number) =>
  Math.max(0, Math.min(100, value));
