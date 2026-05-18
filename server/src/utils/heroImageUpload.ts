import { Response } from "express";
import { uploadImage } from "./uploadImage";

export const uploadHeroImage = async (
  buffer: Buffer,
): Promise<string | null> => {
  const uploaded = await uploadImage(buffer, {
    folder: "ecommerce/hero",
    preset: "hero",
  });
  return uploaded.secure_url ?? null;
};

export const uploadHeroImageOrRespond = async (
  file: Express.Multer.File,
  res: Response,
): Promise<{ ok: true; imageUrl: string } | { ok: false; response: Response }> => {
  try {
    const imageUrl = await uploadHeroImage(file.buffer);
    if (!imageUrl) {
      return {
        ok: false,
        response: res.status(502).json({ message: "Hero image upload failed" }),
      };
    }
    return { ok: true, imageUrl };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Hero image upload failed";
    return {
      ok: false,
      response: res.status(502).json({ message }),
    };
  }
};
