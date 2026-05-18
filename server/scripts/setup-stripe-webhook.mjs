/**
 * Creates Stripe webhook endpoint and prints signing secret.
 * Usage: node scripts/setup-stripe-webhook.mjs
 * Requires STRIPE_SECRET_KEY in server/.env (or env).
 */
import "dotenv/config";
import Stripe from "stripe";

const webhookUrl =
  process.env.STRIPE_WEBHOOK_URL ||
  "https://server-devlp.vercel.app/api/v1/payments/stripe/webhook";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY in server/.env");
  process.exit(1);
}

const stripe = new Stripe(secret, { apiVersion: "2026-04-22.dahlia" });

const existing = await stripe.webhookEndpoints.list({ limit: 100 });
const match = existing.data.find((e) => e.url === webhookUrl);

if (match) {
  console.log("Webhook already exists:", match.id);
  console.log(
    "If you lost the signing secret, delete this endpoint in Stripe Dashboard and re-run.",
  );
  process.exit(0);
}

const endpoint = await stripe.webhookEndpoints.create({
  url: webhookUrl,
  enabled_events: ["checkout.session.completed", "checkout.session.expired"],
  description: "BoxInWheels production (Vercel)",
});

console.log("STRIPE_WEBHOOK_SECRET=" + endpoint.secret);
