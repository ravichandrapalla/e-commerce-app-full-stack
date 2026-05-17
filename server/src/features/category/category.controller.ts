import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { CATALOG_CATEGORY_NAMES } from "../../constants/catalogCategories";
import { ensureDefaultCategories } from "./category.seed";

export const getCategories = async (_req: Request, res: Response) => {
  await ensureDefaultCategories();

  const categories = await prisma.category.findMany({
    where: { name: { in: [...CATALOG_CATEGORY_NAMES] } },
    orderBy: { name: "asc" },
  });

  res.json(categories);
};
