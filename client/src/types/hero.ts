export type HeroSlide = {
  id: string;
  sortOrder: number;
  imageUrl: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSlidesResponse = {
  slides: HeroSlide[];
};

export type AdminHeroSlidesResponse = {
  slides: HeroSlide[];
  maxSlides: number;
};

export type HeroSlideInput = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  isActive?: boolean;
};
