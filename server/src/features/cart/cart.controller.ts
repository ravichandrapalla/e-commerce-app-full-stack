import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as service from "./cart.service";
import { productQuantitySchema, setQuantitySchema } from "./cart.validation";

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await service.getCart(req.user!.id);
  res.json(cart);
};

export const addItem = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = productQuantitySchema.parse(req.body);
  const item = await service.incrementCartItem(req.user!.id, productId, quantity);
  res.json(item);
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = setQuantitySchema.parse(req.body);
  const item = await service.setCartItemQuantity(req.user!.id, productId, quantity);
  res.json(item);
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  const { productId } = setQuantitySchema.pick({ productId: true }).parse(req.body);
  await service.removeItem(req.user!.id, productId);
  res.json({ success: true });
};

export const decrementItem = async (req: AuthRequest, res: Response) => {
  const { productId } = setQuantitySchema.pick({ productId: true }).parse(req.body);
  const item = await service.decrementCartItem(req.user!.id, productId);
  res.json(item);
};
