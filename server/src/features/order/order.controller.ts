import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as service from "./order.service";

export const checkout = async (req: AuthRequest, res: Response) => {
  const checkoutSession = await service.startCheckout(req.user!.id);

  res.status(201).json(checkoutSession);
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const orders = await service.getOrders(req.user!.id);

  res.json(orders);
};

export const completeDemoCheckout = async (req: AuthRequest, res: Response) => {
  const orderId = String(req.body.orderId || "");
  const order = await service.completeDemoCheckout(req.user!.id, orderId);

  res.json(order);
};
