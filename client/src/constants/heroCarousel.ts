/** Matches server crop and home carousel layout. */
export const HERO_CAROUSEL_ASPECT_CLASS = "aspect-[3/1]";

export const HERO_ACCENT_PRESETS = [
  { label: "Sunset", value: "from-orange-500/90 via-rose-500/80 to-fuchsia-600/85" },
  { label: "Indigo", value: "from-slate-900/90 via-indigo-900/80 to-violet-700/85" },
  { label: "Teal", value: "from-emerald-800/90 via-teal-800/80 to-cyan-700/85" },
  { label: "Amber", value: "from-amber-700/90 via-orange-800/80 to-red-700/85" },
] as const;

export const HERO_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const HERO_IMAGE_HINT =
  "Wide banner images (3:1). JPG, PNG, or WebP up to 5 MB each. Saved as optimized WebP.";
