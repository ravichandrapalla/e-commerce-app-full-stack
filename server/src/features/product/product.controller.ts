import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { createProductSchema, querySchema } from "./product.validation";
import { uploadImage } from "../../utils/uploadImage";

export const create = async (req: Request, res: Response) => {
  let imageUrl = "";

  if (req.file) {
    const uploaded: any = await uploadImage(req.file.buffer);

    imageUrl = uploaded.secure_url;
  }

  const parsed = createProductSchema.parse({
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    imageUrl,
  });

  const product = await createProduct(parsed);

  res.status(201).json({ product });
};

export const list = async (req: Request, res: Response) => {
  const parsed = querySchema.parse(req.query);

  const data = await getProducts(parsed);

  res.json(data);
};

export const getOne = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id as string);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};
export const update = async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id as string, {
    ...req.body,
    price: req.body.price === undefined ? undefined : Number(req.body.price),
    stock: req.body.stock === undefined ? undefined : Number(req.body.stock),
  });

  res.json(product);
};

export const remove = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id as string);

  res.json({
    success: true,
  });
};
