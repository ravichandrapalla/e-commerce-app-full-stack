import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as service from "./cart.service";

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await service.getCart(req.user!.id);
  res.json(cart);
};

export const addItem = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const item = await service.addToCart(req.user!.id, productId, quantity);
  res.json(item);
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  const { itemId, quantity } = req.body;
  const item = await service.updateQuantity(itemId, quantity);
  res.json(item);
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.body;
  await service.removeItem(itemId);
  res.json({ success: true });
};
