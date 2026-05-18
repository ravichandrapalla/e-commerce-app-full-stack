import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { copy } from "../../constants/copy";
import { useHeroSlides } from "../../features/hero/hero.hooks";
import { cn } from "../../lib/utils";
import { typography } from "../../lib/typography";

const AUTOPLAY_MS = 6000;

type CarouselSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  accent: string;
};

export default function HeroCarousel() {
  const { data: apiSlides } = useHeroSlides();

  const slides = useMemo<CarouselSlide[]>(() => {
    if (apiSlides?.length) {
      return apiSlides.map((slide) => ({
        id: slide.id,
        eyebrow: slide.eyebrow,
        title: slide.title,
        description: slide.description,
        cta: slide.cta,
        href: slide.href,
        image: slide.imageUrl,
        accent: slide.accent,
      }));
    }

    return [...copy.home.hero.slides];
  }, [apiSlides]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (!slides.length) return;
      setActive((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="relative overflow-hidden rounded-2xl border shadow-md"
    >
      <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[400px]">
        {slides.map((item, index) => (
          <div
            key={item.id}
            aria-hidden={index !== active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              index === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-r", item.accent)} />
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-10 lg:p-12">
              <p
                className={cn(
                  typography.eyebrow,
                  "animate-in fade-in slide-in-from-bottom-2 text-white/85 duration-500",
                )}
              >
                {item.eyebrow}
              </p>
              <h2 className="animate-in fade-in slide-in-from-bottom-3 mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl duration-500">
                {item.title}
              </h2>
              <p className="animate-in fade-in slide-in-from-bottom-4 mt-3 max-w-xl text-sm leading-6 text-white/90 sm:text-base duration-500">
                {item.description}
              </p>
              <div className="animate-in fade-in slide-in-from-bottom-5 mt-6 duration-500">
                <Link
                  to={item.href}
                  className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

        {slides.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between sm:left-5 sm:right-5">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-foreground shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-foreground shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === active
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
