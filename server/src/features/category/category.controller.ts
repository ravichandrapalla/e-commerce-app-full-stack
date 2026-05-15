import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  res.json(categories);
};
