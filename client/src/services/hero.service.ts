import { api } from "../lib/axios";
import type { HeroSlidesResponse } from "../types/hero";

export const getHeroSlidesApi = () => api.get<HeroSlidesResponse>("/hero-slides");
