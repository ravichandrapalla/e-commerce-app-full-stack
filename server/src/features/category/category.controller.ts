import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { ensureDefaultCategories } from "./category.seed";

export const getCategories = async (_req: Request, res: Response) => {
  await ensureDefaultCategories();

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  res.json(categories);
};
