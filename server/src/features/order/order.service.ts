import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import { stripe } from "../../config/stripe";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "../email/email.service";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const orderInclude = {
  items: {
    include: {
      product: true,
    },
  },
};

const getCartForCheckout = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      user: {
        select: { email: true, name: true },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.product.isPublished) {
      throw new Error(`${item.product.title} is no longer available`);
    }

    if (item.quantity < 1) {
      throw new Error("Cart contains an invalid quantity");
    }

    if (item.product.stock < item.quantity) {
      throw new Error(`Only ${item.product.stock} unit(s) available for ${item.product.title}`);
    }
  }

  return cart;
};

export const startCheckout = async (userId: string) => {
  const cart = await getCartForCheckout(userId);
  const totalAmount = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: OrderStatus.PAYMENT_PENDING,
      paymentProvider: stripe ? "stripe" : "demo",
      customerEmail: cart.user.email,
      shippingName: cart.user.name,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: orderInclude,
  });

  if (!stripe) {
    return {
      order,
      checkoutUrl: `${clientUrl}/checkout/demo?order_id=${order.id}`,
      paymentProvider: "demo",
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/checkout/cancel?order_id=${order.id}`,
    customer_email: cart.user.email,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      userId,
    },
    shipping_address_collection: {
      allowed_countries: ["IN", "US"],
    },
    line_items: cart.items.map((item) => {
      const productData: {
        name: string;
        description: string;
        images?: string[];
      } = {
        name: item.product.title,
        description: item.product.description.slice(0, 250),
      };

      if (item.product.imageUrl) {
        productData.images = [item.product.imageUrl];
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          unit_amount: Math.round(item.product.price * 100),
          product_data: productData,
        },
      };
    }),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentSessionId: session.id,
    },
  });

  return {
    order,
    checkoutUrl: session.url,
    paymentProvider: "stripe",
  };
};

export const fulfillOrder = async (orderId: string, paymentIntentId?: string | null) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const fulfilledStatuses: OrderStatus[] = [
    OrderStatus.PAID,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
  ];

  if (fulfilledStatuses.includes(order.status)) {
    return order;
  }

  const paidOrder = await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error(`${item.product.title} is no longer available in the requested quantity`);
      }
    }

    await tx.cartItem.deleteMany({
      where: {
        cart: {
          userId: order.userId,
        },
      },
    });

    return tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paidAt: new Date(),
        paymentIntentId: paymentIntentId || order.paymentIntentId,
      },
      include: orderInclude,
    });
  });

  await sendOrderConfirmationEmail({
    to: order.customerEmail || order.user.email,
    orderId: paidOrder.id,
    totalAmount: paidOrder.totalAmount,
    items: paidOrder.items.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  return paidOrder;
};

export const completeDemoCheckout = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      paymentProvider: "demo",
    },
  });

  if (!order) {
    throw new Error("Demo order not found");
  }

  return fulfillOrder(order.id, "demo-payment-intent");
};

export const markPaymentFailed = async (orderId: string) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.PAYMENT_FAILED },
  });
};

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const adminOrderInclude = {
  ...orderInclude,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const allowedStatusTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PAID]: [
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ],
  [OrderStatus.PROCESSING]: [
    OrderStatus.SHIPPED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ],
  [OrderStatus.SHIPPED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.REFUNDED],
  [OrderStatus.OUT_FOR_DELIVERY]: [
    OrderStatus.DELIVERED,
    OrderStatus.REFUNDED,
  ],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
};

export const getAllOrdersForAdmin = async () => {
  return prisma.order.findMany({
    include: adminOrderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateOrderStatusForAdmin = async (
  orderId: string,
  status: OrderStatus,
) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true } },
    },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  if (
    existingOrder.status === OrderStatus.PAYMENT_PENDING ||
    existingOrder.status === OrderStatus.PAYMENT_FAILED
  ) {
    throw new Error("Payment must be completed before fulfillment updates");
  }

  if (
    status !== existingOrder.status &&
    !allowedStatusTransitions[existingOrder.status]?.includes(status)
  ) {
    throw new Error("Invalid order status transition");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: adminOrderInclude,
  });

  if (existingOrder.status !== status) {
    await sendOrderStatusEmail({
      to: order.customerEmail || order.user.email,
      orderId: order.id,
      status: order.status,
    });
  }

  return order;
};
