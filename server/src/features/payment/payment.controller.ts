import { Request, Response } from "express";
import { stripe } from "../../config/stripe";
import { prisma } from "../../config/db";
import { fulfillOrder, markPaymentFailed } from "../order/order.service";

export const stripeWebhook = async (req: Request, res: Response) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true, skipped: true });
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ message: "Missing Stripe signature" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return res.status(400).json({ message });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { orderId?: string };
      client_reference_id?: string | null;
      payment_intent?: string | { id: string } | null;
      shipping_details?: {
        name?: string | null;
        address?: {
          line1?: string | null;
          line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
        } | null;
      } | null;
    };
    const orderId = session.metadata?.orderId || session.client_reference_id;

    if (orderId) {
      const address = session.shipping_details?.address;
      if (address) {
        const shippingUpdate: Record<string, string | null> = {};
        const name = session.shipping_details?.name;
        if (name) shippingUpdate.shippingName = name;
        if (address.line1) shippingUpdate.shippingLine1 = address.line1;
        if (address.line2) shippingUpdate.shippingLine2 = address.line2;
        if (address.city) shippingUpdate.shippingCity = address.city;
        if (address.state) shippingUpdate.shippingState = address.state;
        if (address.postal_code) shippingUpdate.shippingPostalCode = address.postal_code;
        if (address.country) shippingUpdate.shippingCountry = address.country;

        if (Object.keys(shippingUpdate).length > 0) {
          await prisma.order.update({
            where: { id: orderId },
            data: shippingUpdate,
          });
        }
      }

      await fulfillOrder(orderId, session.payment_intent?.toString());
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId || session.client_reference_id;

    if (orderId) {
      await markPaymentFailed(orderId);
    }
  }

  res.json({ received: true });
};

