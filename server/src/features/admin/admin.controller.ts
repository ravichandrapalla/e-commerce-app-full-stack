import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import {
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin,
} from "../order/order.service";

export const getDashboardStats = async (_req: Request, res: Response) => {
  const [
    buyers,
    sellers,
    products,
    lowStockProducts,
    outOfStockProducts,
    orders,
    pendingFulfillment,
    revenue,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.product.count(),
    prisma.product.count({
      where: {
        isPublished: true,
        stock: {
          gt: 0,
          lte: 5,
        },
      },
    }),
    prisma.product.count({
      where: {
        isPublished: true,
        stock: 0,
      },
    }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"],
        },
      },
    }),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  res.json({
    buyers,
    sellers,
    products,
    lowStockProducts,
    outOfStockProducts,
    orders,
    pendingFulfillment,
    revenue: revenue._sum.totalAmount || 0,
  });
};

export const getAdminOrders = async (_req: Request, res: Response) => {
  const orders = await getAllOrdersForAdmin();

  res.json(orders);
};

export const updateAdminOrderStatus = async (req: Request, res: Response) => {
  const orderId = String(req.params.orderId || "");
  const status = String(req.body.status || "") as OrderStatus;
  const order = await updateOrderStatusForAdmin(orderId, status);

  res.json(order);
};
