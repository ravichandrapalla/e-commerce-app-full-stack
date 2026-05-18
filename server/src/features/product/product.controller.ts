import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { canManageCatalog, isAdmin } from "../../constants/roles";
import {
  createProduct,
  deleteProduct,
  getOwnedProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { createProductSchema, querySchema } from "./product.validation";
import { uploadProductImage as uploadProductImageToCloudinary } from "../../utils/productImageUpload";
import { validateImageFile } from "../../utils/validateImageFile";
import { isStorefrontVisible } from "./product.visibility";

export const create = async (req: AuthRequest, res: Response) => {
  if (!req.user || !canManageCatalog(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const imageValidationError = validateImageFile(req.file, { required: true });
  if (imageValidationError) {
    return res.status(400).json({ message: imageValidationError });
  }

  const upload = await uploadProductImageToCloudinary(req.file!, res);
  if (!upload.ok) return upload.response;
  const imageUrl = upload.imageUrl;

  const parsed = createProductSchema.parse({
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    imageUrl,
  });

  const submittedByAdmin = isAdmin(req.user.role);
  const product = await createProduct({
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    stock: parsed.stock,
    categoryId: parsed.categoryId,
    sellerId: req.user.id,
    submittedByAdmin,
    imageUrl: parsed.imageUrl,
  });

  const message = submittedByAdmin
    ? "Product created and published"
    : "Product submitted for admin approval";

  res.status(201).json({ product, message });
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

  const canViewPrivate =
    req.user &&
    (isAdmin(req.user.role) || product.sellerId === req.user.id);

  if (!isStorefrontVisible(product) && !canViewPrivate) {
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

  let imageUrl: string | undefined;

  if (req.file) {
    const imageValidationError = validateImageFile(req.file);
    if (imageValidationError) {
      return res.status(400).json({ message: imageValidationError });
    }

    const upload = await uploadProductImageToCloudinary(req.file, res);
    if (!upload.ok) return upload.response;
    imageUrl = upload.imageUrl;
  }

  const adminUser = isAdmin(req.user.role);
  const product = await updateProduct(
    req.params.id as string,
    {
      ...req.body,
      price: req.body.price === undefined ? undefined : Number(req.body.price),
      stock: req.body.stock === undefined ? undefined : Number(req.body.stock),
      ...(imageUrl ? { imageUrl } : {}),
      ...(adminUser && req.body.isPublished !== undefined
        ? {
            isPublished:
              req.body.isPublished === true || req.body.isPublished === "true",
          }
        : {}),
    },
    { isAdmin: adminUser },
  );

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
