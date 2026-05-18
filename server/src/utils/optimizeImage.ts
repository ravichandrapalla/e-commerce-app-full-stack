import sharp from "sharp";
import {
  IMAGE_OPTIMIZE_PRESETS,
  WEBP_OPTIMIZE_OPTIONS,
  type ImagePreset,
} from "../constants/imageOptimize";

/**
 * Resize and convert an image to WebP with near-lossless settings for
 * sharp detail and a smaller payload before Cloudinary upload.
 */
export const optimizeImage = async (
  input: Buffer,
  preset: ImagePreset,
): Promise<Buffer> => {
  const { maxWidth, maxHeight, fit } = IMAGE_OPTIMIZE_PRESETS[preset];

  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(maxWidth, maxHeight, {
      fit,
      position: "centre",
      withoutEnlargement: true,
    })
    .webp(WEBP_OPTIMIZE_OPTIONS)
    .toBuffer();
};
