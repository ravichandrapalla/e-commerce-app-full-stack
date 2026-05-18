import { Resend } from "resend";
import { STORE_EMAIL_FROM, STORE_NAME } from "../../constants/brand";

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

const fromEmail =
  process.env.EMAIL_FROM ||
  process.env.ORDER_EMAIL_FROM ||
  STORE_EMAIL_FROM;

const clientUrl = () =>
  process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:5173";

const sendHtmlEmail = async (payload: {
  to: string;
  subject: string;
  html: string;
  previewLabel: string;
}) => {
  if (!resend) {
    console.log(payload.previewLabel, {
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
};

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
      <p>Thanks for shopping with ${STORE_NAME}. Order <strong>#${payload.orderId.slice(
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

  await sendHtmlEmail({
    to: payload.to,
    subject: `Order #${payload.orderId.slice(0, 8)} confirmed`,
    html,
    previewLabel: "ORDER_EMAIL_PREVIEW",
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
    body: `Your order was delivered. Thanks for shopping with ${STORE_NAME}.`,
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

  await sendHtmlEmail({
    to: payload.to,
    subject,
    html,
    previewLabel: "ORDER_STATUS_EMAIL_PREVIEW",
  });
};

type VerificationEmailPayload = {
  to: string;
  name: string;
  token: string;
};

export const sendVerificationEmail = async (payload: VerificationEmailPayload) => {
  const verifyUrl = `${clientUrl()}/verify-email?token=${encodeURIComponent(payload.token)}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
      <h1 style="font-size:24px">Verify your email</h1>
      <p>Hi ${payload.name},</p>
      <p>Thanks for joining ${STORE_NAME}. Confirm your email to sign in and use your account.</p>
      <p style="margin:28px 0">
        <a href="${verifyUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Verify email
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280">Or paste this link in your browser:<br>${verifyUrl}</p>
      <p style="font-size:13px;color:#6b7280">This link expires in 24 hours.</p>
    </div>
  `;

  await sendHtmlEmail({
    to: payload.to,
    subject: `Verify your ${STORE_NAME} account`,
    html,
    previewLabel: "VERIFICATION_EMAIL_PREVIEW",
  });
};

type ProductStatusEmailPayload = {
  to: string;
  sellerName: string;
  productTitle: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
};

export const sendProductApprovalEmail = async (
  payload: ProductStatusEmailPayload,
) => {
  if (!payload.to) return;

  const isApproved = payload.status === "APPROVED";
  const subject = isApproved
    ? `Your product "${payload.productTitle}" is live`
    : `Update on your product "${payload.productTitle}"`;

  const body = isApproved
    ? `<p>Good news — <strong>${payload.productTitle}</strong> has been approved and is now visible in the catalog.</p>`
    : `<p>Your listing <strong>${payload.productTitle}</strong> was not approved.</p>
       <p><strong>Reason:</strong> ${payload.rejectionReason || "Listing did not meet marketplace guidelines."}</p>
       <p>You can edit the product and submit it again from your seller hub.</p>`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
      <h1 style="font-size:24px">Product listing update</h1>
      <p>Hi ${payload.sellerName},</p>
      ${body}
      <p style="margin-top:24px">
        <a href="${clientUrl()}/seller/products" style="color:#0f172a;font-weight:600">View my products</a>
      </p>
    </div>
  `;

  await sendHtmlEmail({
    to: payload.to,
    subject,
    html,
    previewLabel: "PRODUCT_STATUS_EMAIL_PREVIEW",
  });
};
