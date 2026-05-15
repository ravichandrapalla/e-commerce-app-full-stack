import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getDashboardStats = async (_req: Request, res: Response) => {
  const [users, products, orders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  res.json({
    users,
    products,
    orders,
    revenue: revenue._sum.totalAmount || 0,
  });
};
