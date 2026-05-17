import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as service from "./order.service";
import { checkoutSchema } from "./order.validation";

export const checkout = async (req: AuthRequest, res: Response) => {
  const { shipping } = checkoutSchema.parse(req.body);
  const checkoutSession = await service.startCheckout(req.user!.id, shipping);

  res.status(201).json(checkoutSession);
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const orders = await service.getOrders(req.user!.id);

  res.json(orders);
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  const order = await service.getOrderById(
    req.user!.id,
    String(req.params.id),
  );

  res.json(order);
};

export const completeDemoCheckout = async (req: AuthRequest, res: Response) => {
  const orderId = String(req.body.orderId || "");
  const order = await service.completeDemoCheckout(req.user!.id, orderId);

  res.json(order);
};
