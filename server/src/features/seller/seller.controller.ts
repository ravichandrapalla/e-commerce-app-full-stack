import { Response } from "express";
import { OrderStatus } from "@prisma/client";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getSellerProducts } from "../product/product.service";
import {
  getSellerDashboardStats,
  getSellerOrders,
  updateSellerOrderStatus,
} from "./seller.service";

export const getStats = async (req: AuthRequest, res: Response) => {
  const stats = await getSellerDashboardStats(req.user!.id);
  res.json(stats);
};

export const listProducts = async (req: AuthRequest, res: Response) => {
  const data = await getSellerProducts(req.user!.id, req.query);
  res.json(data);
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const orders = await getSellerOrders(req.user!.id);
  res.json(orders);
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = String(req.params.orderId || "");
    const status = String(req.body.status || "") as OrderStatus;
    const order = await updateSellerOrderStatus(req.user!.id, orderId, status);
    res.json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    res.status(400).json({ message });
  }
};
