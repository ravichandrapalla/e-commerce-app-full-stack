import crypto from "crypto";

export const VERIFICATION_TOKEN_BYTES = 32;
export const VERIFICATION_EXPIRY_HOURS = 24;

export const generateVerificationToken = () =>
  crypto.randomBytes(VERIFICATION_TOKEN_BYTES).toString("hex");

export const verificationExpiryDate = () =>
  new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);
