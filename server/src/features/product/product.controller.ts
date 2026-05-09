import { Request, Response } from "express";
import { createProduct, getProductById, getProducts } from "./product.service";
import { createProductSchema, querySchema } from "./product.validation";

export const create = async (req: Request, res: Response) => {
  const parsed = createProductSchema.parse(req.body);

  const product = await createProduct(parsed);

  res.status(201).json({ product });
};

export const list = async (req: Request, res: Response) => {
  const parsed = querySchema.parse(req.query);

  const data = await getProducts(parsed);

  res.json(data);
};

export const getOne = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};
