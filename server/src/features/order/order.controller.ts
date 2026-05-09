import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as service from "./order.service";

export const checkout = async (req: AuthRequest, res: Response) => {
  const order = await service.checkout(req.user!.id);

  res.status(201).json(order);
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const orders = await service.getOrders(req.user!.id);

  res.json(orders);
};
