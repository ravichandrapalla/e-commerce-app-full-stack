import Stripe from "stripe";

export const stripe =
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.length > 0
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-04-22.dahlia",
      })
    : null;
