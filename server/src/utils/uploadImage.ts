import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary";
import type { ImagePreset } from "../constants/imageOptimize";
import { optimizeImage } from "./optimizeImage";

type UploadOptions = {
  folder?: string;
  preset?: ImagePreset;
};

type CloudinaryUploadResult = {
  secure_url?: string;
};

export const uploadImage = async (
  fileBuffer: Buffer,
  options: UploadOptions = {},
) => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server .env.",
    );
  }

  const folder = options.folder ?? "ecommerce/products";
  const preset = options.preset ?? "product";
  const optimizedBuffer = await optimizeImage(fileBuffer, preset);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          format: "webp",
          resource_type: "image",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result ?? {});
        },
      )
      .end(optimizedBuffer);
  });
};
