import { Response } from "express";
import { uploadImage } from "./uploadImage";

type UploadProductImageResult =
  | { ok: true; imageUrl: string }
  | { ok: false; response: Response };

export const uploadProductImage = async (
  file: Express.Multer.File,
  res: Response,
): Promise<UploadProductImageResult> => {
  try {
    const uploaded = await uploadImage(file.buffer, {
      folder: "ecommerce/products",
      preset: "product",
    });

    if (!uploaded.secure_url) {
      return {
        ok: false,
        response: res.status(502).json({ message: "Image upload failed" }),
      };
    }

    return { ok: true, imageUrl: uploaded.secure_url };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Image upload failed";
    return {
      ok: false,
      response: res.status(502).json({ message }),
    };
  }
};
