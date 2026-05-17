import { Resend } from "resend";

type OrderEmailItem = {
  title: string;
  quantity: number;
  price: number;
};

type OrderEmailPayload = {
  to?: string | null;
  orderId: string;
  totalAmount: number;
  items: OrderEmailItem[];
};

type OrderStatusEmailPayload = {
  to?: string | null;
  orderId: string;
  status: string;
};

const resend =
  process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 0
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const fromEmail = process.env.ORDER_EMAIL_FROM || "RaviCommerce <onboarding@resend.dev>";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export const sendOrderConfirmationEmail = async (payload: OrderEmailPayload) => {
  if (!payload.to) return;

  const rows = payload.items
    .map(
      (item) =>
        `<tr><td>${item.title}</td><td align="center">${item.quantity}</td><td align="right">${formatCurrency(
          item.price * item.quantity,
        )}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
      <h1 style="font-size:24px">Your order is confirmed</h1>
      <p>Thanks for shopping with RaviCommerce. Order <strong>#${payload.orderId.slice(
        0,
        8,
      )}</strong> is paid and being prepared.</p>
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb">
        <thead><tr style="background:#f9fafb"><th align="left">Item</th><th>Qty</th><th align="right">Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:18px;font-weight:700">Total: ${formatCurrency(payload.totalAmount)}</p>
    </div>
  `;

  if (!resend) {
    console.log("ORDER_EMAIL_PREVIEW", {
      to: payload.to,
      subject: `Order #${payload.orderId.slice(0, 8)} confirmed`,
      html,
    });
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: payload.to,
    subject: `Order #${payload.orderId.slice(0, 8)} confirmed`,
    html,
  });
};

const statusCopy: Record<string, { subject: string; body: string }> = {
  PROCESSING: {
    subject: "is being prepared",
    body: "Your order is now being prepared by our team.",
  },
  SHIPPED: {
    subject: "has shipped",
    body: "Your order has shipped and is on the way.",
  },
  OUT_FOR_DELIVERY: {
    subject: "is out for delivery",
    body: "Your order is out for delivery and should reach you soon.",
  },
  DELIVERED: {
    subject: "was delivered",
    body: "Your order was delivered. Thanks for shopping with RaviCommerce.",
  },
  CANCELLED: {
    subject: "was cancelled",
    body: "Your order was cancelled. If this looks wrong, please contact support.",
  },
  REFUNDED: {
    subject: "was refunded",
    body: "Your refund has been marked for this order.",
  },
};

export const sendOrderStatusEmail = async (payload: OrderStatusEmailPayload) => {
  if (!payload.to) return;

  const copy = statusCopy[payload.status];
  if (!copy) return;

  const orderNumber = payload.orderId.slice(0, 8);
  const subject = `Order #${orderNumber} ${copy.subject}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
      <h1 style="font-size:24px">Order update</h1>
      <p>${copy.body}</p>
      <p>Order <strong>#${orderNumber}</strong></p>
    </div>
  `;

  if (!resend) {
    console.log("ORDER_STATUS_EMAIL_PREVIEW", {
      to: payload.to,
      subject,
      html,
    });
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: payload.to,
    subject,
    html,
  });
};
