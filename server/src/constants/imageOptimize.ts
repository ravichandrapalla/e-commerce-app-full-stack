export type ImagePreset = "product" | "avatar" | "hero";

/** Wide banner crop matching the home carousel (~3:1). */
export const HERO_CAROUSEL_ASPECT = { width: 3, height: 1 } as const;

/** Resize bounds per use case (aspect ratio preserved unless avatar cover crop). */
export const IMAGE_OPTIMIZE_PRESETS = {
  product: {
    maxWidth: 1200,
    maxHeight: 1200,
    fit: "inside" as const,
  },
  avatar: {
    maxWidth: 512,
    maxHeight: 512,
    fit: "cover" as const,
  },
  hero: {
    maxWidth: 1920,
    maxHeight: 640,
    fit: "cover" as const,
  },
};

/**
 * WebP near-lossless: visually lossless clarity with smaller files than PNG/JPEG.
 * @see https://sharp.pixelplumbing.com/api-output#webp
 */
export const WEBP_OPTIMIZE_OPTIONS = {
  nearLossless: true,
  quality: 100,
  effort: 6,
  smartSubsample: true,
} as const;
