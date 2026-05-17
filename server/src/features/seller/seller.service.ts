import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import {
  updateOrderStatusForAdmin,
} from "../order/order.service";

export const getSellerDashboardStats = async (sellerId: string) => {
  const sellerProductIds = (
    await prisma.product.findMany({
      where: { sellerId },
      select: { id: true },
    })
  ).map((product) => product.id);

  if (sellerProductIds.length === 0) {
    return {
      products: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      orders: 0,
      pendingFulfillment: 0,
      revenue: 0,
    };
  }

  const [
    products,
    lowStockProducts,
    outOfStockProducts,
    orderItems,
    pendingFulfillment,
    revenue,
  ] = await Promise.all([
    prisma.product.count({ where: { sellerId } }),
    prisma.product.count({
      where: {
        sellerId,
        isPublished: true,
        stock: { gt: 0, lte: 5 },
      },
    }),
    prisma.product.count({
      where: {
        sellerId,
        stock: 0,
      },
    }),
    prisma.orderItem.findMany({
      where: {
        productId: { in: sellerProductIds },
        order: {
          status: {
            notIn: [OrderStatus.PAYMENT_PENDING, OrderStatus.PAYMENT_FAILED],
          },
        },
      },
      select: { orderId: true },
      distinct: ["orderId"],
    }),
    prisma.orderItem.findMany({
      where: {
        productId: { in: sellerProductIds },
        order: {
          status: {
            in: [
              OrderStatus.PAID,
              OrderStatus.PROCESSING,
              OrderStatus.SHIPPED,
              OrderStatus.OUT_FOR_DELIVERY,
            ],
          },
        },
      },
      select: { orderId: true },
      distinct: ["orderId"],
    }),
    prisma.orderItem.findMany({
      where: {
        productId: { in: sellerProductIds },
        order: {
          status: {
            notIn: [
              OrderStatus.PAYMENT_PENDING,
              OrderStatus.PAYMENT_FAILED,
              OrderStatus.CANCELLED,
            ],
          },
        },
      },
      select: {
        price: true,
        quantity: true,
      },
    }),
  ]);

  return {
    products,
    lowStockProducts,
    outOfStockProducts,
    orders: orderItems.length,
    pendingFulfillment: pendingFulfillment.length,
    revenue: revenue.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  };
};

export const getSellerOrders = async (sellerId: string) => {
  const sellerProductIds = (
    await prisma.product.findMany({
      where: { sellerId },
      select: { id: true },
    })
  ).map((product) => product.id);

  if (sellerProductIds.length === 0) {
    return [];
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: sellerProductIds },
    },
    include: {
      product: true,
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: {
        createdAt: "desc",
      },
    },
  });

  const ordersMap = new Map<
    string,
    {
      id: string;
      status: OrderStatus;
      totalAmount: number;
      createdAt: Date;
      updatedAt: Date;
      buyer: { id: string; name: string; email: string };
      items: Array<{
        id: string;
        productId: string;
        quantity: number;
        price: number;
        product: (typeof orderItems)[number]["product"];
      }>;
      sellerSubtotal: number;
    }
  >();

  for (const item of orderItems) {
    const existing = ordersMap.get(item.orderId);

    const line = {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product,
    };

    if (existing) {
      existing.items.push(line);
      existing.sellerSubtotal += item.price * item.quantity;
      continue;
    }

    ordersMap.set(item.orderId, {
      id: item.order.id,
      status: item.order.status,
      totalAmount: item.order.totalAmount,
      createdAt: item.order.createdAt,
      updatedAt: item.order.updatedAt,
      buyer: item.order.user,
      items: [line],
      sellerSubtotal: item.price * item.quantity,
    });
  }

  return Array.from(ordersMap.values());
};

export const updateSellerOrderStatus = async (
  sellerId: string,
  orderId: string,
  status: OrderStatus,
) => {
  const sellerProductIds = (
    await prisma.product.findMany({
      where: { sellerId },
      select: { id: true },
    })
  ).map((product) => product.id);

  const hasSellerItems = await prisma.orderItem.findFirst({
    where: {
      orderId,
      productId: { in: sellerProductIds },
    },
  });

  if (!hasSellerItems) {
    throw new Error("Order not found");
  }

  return updateOrderStatusForAdmin(orderId, status);
};
