import { useQuery } from "@tanstack/react-query";
import { getHeroSlidesApi } from "../../services/hero.service";

export const heroSlidesQueryKey = ["hero-slides"] as const;

export const useHeroSlides = () =>
  useQuery({
    queryKey: heroSlidesQueryKey,
    queryFn: async () => {
      const res = await getHeroSlidesApi();
      return res.data.slides;
    },
    staleTime: 60_000,
  });
