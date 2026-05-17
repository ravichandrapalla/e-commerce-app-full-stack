import { prisma } from "../../config/db";

export const createProduct = async (data: any) => {
  return prisma.product.create({ data });
};

export const getProducts = async (query: any) => {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 10), 50);
  const skip = (page - 1) * limit;

  const where: any = {
    isPublished: true,
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

  if (query.inStock === "true") {
    where.stock = {
      gt: 0,
    };
  }

  const sortMap: Record<string, any> = {
    newest: { createdAt: "desc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    stock_desc: { stock: "desc" },
  };
  const orderBy = sortMap[query.sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: limit,
      orderBy,
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
    include: {
      category: true,
    },
  });
};
export const updateProduct = async (id: string, data: any) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
