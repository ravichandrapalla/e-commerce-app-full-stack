import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { canManageCatalog } from "../../constants/roles";
import {
  createProduct,
  deleteProduct,
  getOwnedProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { createProductSchema, querySchema } from "./product.validation";
import { uploadImage } from "../../utils/uploadImage";

export const create = async (req: AuthRequest, res: Response) => {
  if (!req.user || !canManageCatalog(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let imageUrl = "";

  if (req.file) {
    const uploaded = (await uploadImage(req.file.buffer)) as { secure_url: string };
    imageUrl = uploaded.secure_url;
  }

  const parsed = createProductSchema.parse({
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    imageUrl,
  });

  const product = await createProduct({
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    stock: parsed.stock,
    categoryId: parsed.categoryId,
    sellerId: req.user.id,
    ...(parsed.imageUrl ? { imageUrl: parsed.imageUrl } : {}),
  });

  res.status(201).json({ product });
};

export const list = async (req: AuthRequest, res: Response) => {
  const parsed = querySchema.parse(req.query);
  const data = await getProducts(parsed);
  res.json(data);
};

export const getOne = async (req: AuthRequest, res: Response) => {
  const product = await getProductById(req.params.id as string);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};

export const update = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const owned = await getOwnedProduct(
    req.params.id as string,
    req.user.id,
    req.user.role,
  );

  if (!owned) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = await updateProduct(req.params.id as string, {
    ...req.body,
    price: req.body.price === undefined ? undefined : Number(req.body.price),
    stock: req.body.stock === undefined ? undefined : Number(req.body.stock),
    isPublished:
      req.body.isPublished === undefined
        ? undefined
        : req.body.isPublished === true || req.body.isPublished === "true",
  });

  res.json(product);
};

export const remove = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const owned = await getOwnedProduct(
    req.params.id as string,
    req.user.id,
    req.user.role,
  );

  if (!owned) {
    return res.status(404).json({ message: "Product not found" });
  }

  await deleteProduct(req.params.id as string);

  res.json({
    success: true,
  });
};
