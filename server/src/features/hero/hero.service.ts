import { prisma } from "../../config/db";
import { STORE_NAME } from "../../constants/brand";
import {
  HERO_ACCENT_PRESETS,
  HERO_CAROUSEL_MAX_SLIDES,
} from "../../constants/heroCarousel";

export type HeroSlideInput = {
  imageUrl: string;
  eyebrow: string;
  title: string;
  description: string;
  cta?: string;
  href?: string;
  accent?: string;
  isActive?: boolean;
};

const nextSortOrder = async () => {
  const last = await prisma.heroSlide.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
};

export const listActiveHeroSlides = () =>
  prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

export const listAllHeroSlides = () =>
  prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

export const countHeroSlides = () => prisma.heroSlide.count();

export const createHeroSlide = async (data: HeroSlideInput) => {
  const total = await countHeroSlides();
  if (total >= HERO_CAROUSEL_MAX_SLIDES) {
    throw new Error(`Maximum ${HERO_CAROUSEL_MAX_SLIDES} carousel slides allowed`);
  }

  const sortOrder = await nextSortOrder();
  const accent =
    data.accent ?? HERO_ACCENT_PRESETS[sortOrder % HERO_ACCENT_PRESETS.length];

  return prisma.heroSlide.create({
    data: {
      imageUrl: data.imageUrl,
      eyebrow: data.eyebrow,
      title: data.title,
      description: data.description,
      cta: data.cta ?? "Shop now",
      href: data.href ?? "/#shop",
      accent,
      isActive: data.isActive ?? true,
      sortOrder,
    },
  });
};

export const updateHeroSlide = async (
  id: string,
  data: Partial<HeroSlideInput>,
) => {
  return prisma.heroSlide.update({
    where: { id },
    data,
  });
};

export const deleteHeroSlide = async (id: string) => {
  return prisma.heroSlide.delete({ where: { id } });
};

export const getHeroSlideById = async (id: string) => {
  return prisma.heroSlide.findUnique({ where: { id } });
};

export const reorderHeroSlides = async (orderedIds: string[]) => {
  const slides = await prisma.heroSlide.findMany({ select: { id: true } });
  const existingIds = new Set(slides.map((slide) => slide.id));

  if (orderedIds.length !== slides.length) {
    throw new Error("Reorder must include every slide");
  }

  for (const id of orderedIds) {
    if (!existingIds.has(id)) {
      throw new Error("Invalid slide id in reorder list");
    }
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  return listAllHeroSlides();
};

export const defaultSlideCopy = (index: number) => ({
  eyebrow: "Featured",
  title: `Featured collection ${index + 1}`,
  description: `Discover curated picks from ${STORE_NAME}.`,
  cta: "Shop now",
  href: "/#shop",
  accent: HERO_ACCENT_PRESETS[index % HERO_ACCENT_PRESETS.length],
});
