import { ProductApprovalStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import { isAdmin } from "../../constants/roles";
import { storefrontProductWhere } from "./product.visibility";

const productInclude = {
  category: true,
  seller: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const createProduct = async (data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  sellerId: string;
  submittedByAdmin: boolean;
}) => {
  const approvalStatus = data.submittedByAdmin
    ? ProductApprovalStatus.APPROVED
    : ProductApprovalStatus.PENDING;

  return prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      sellerId: data.sellerId,
      imageUrl: data.imageUrl,
      approvalStatus,
      isPublished: data.submittedByAdmin,
    },
    include: productInclude,
  });
};

export const getProducts = async (query: Record<string, unknown>) => {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 10), 50);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    ...storefrontProductWhere,
  };

  if (query.search) {
    where.title = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {
      gte: query.minPrice ? Number(query.minPrice) : undefined,
      lte: query.maxPrice ? Number(query.maxPrice) : undefined,
    };
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.sellerId) {
    where.sellerId = query.sellerId;
  }

  if (query.inStock === "true") {
    where.stock = {
      gt: 0,
    };
  }

  const sortMap: Record<string, object> = {
    newest: { createdAt: "desc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    stock_desc: { stock: "desc" },
  };
  const orderBy =
    sortMap[String(query.sort || "newest")] ?? sortMap.newest;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip,
      take: limit,
      orderBy: orderBy as { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getSellerProducts = async (
  sellerId: string,
  query: Record<string, unknown>,
) => {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 50), 100);
  const skip = (page - 1) * limit;

  const where = { sellerId };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
};

export const getOwnedProduct = async (
  id: string,
  userId: string,
  role: string,
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return null;
  }

  if (isAdmin(role) || product.sellerId === userId) {
    return product;
  }

  return null;
};

export const updateProduct = async (
  id: string,
  data: Record<string, unknown>,
  options?: { isAdmin: boolean },
) => {
  const payload = { ...data };

  if (!options?.isAdmin) {
    delete payload.isPublished;
    delete payload.approvalStatus;
    delete payload.rejectionReason;
    delete payload.reviewedAt;
    delete payload.reviewedById;
  }

  return prisma.product.update({
    where: { id },
    data: payload,
    include: productInclude,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
