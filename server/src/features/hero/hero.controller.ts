import { Request, Response } from "express";
import { listActiveHeroSlides } from "./hero.service";

export const listPublic = async (_req: Request, res: Response) => {
  const slides = await listActiveHeroSlides();
  res.json({ slides });
};
