import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "../../lib/utils";

const slides = [
  {
    id: "summer",
    eyebrow: "Limited time",
    title: "Summer essentials up to 40% off",
    description:
      "Refresh your wardrobe and home setup with curated picks from top categories.",
    cta: "Shop deals",
    href: "/#shop",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    accent: "from-orange-500/90 via-rose-500/80 to-fuchsia-600/85",
  },
  {
    id: "tech",
    eyebrow: "New arrivals",
    title: "Smart gadgets for everyday life",
    description:
      "Discover electronics, accessories, and must-have tech with fast delivery.",
    cta: "Browse electronics",
    href: "/#shop",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80",
    accent: "from-slate-900/90 via-indigo-900/80 to-violet-700/85",
  },
  {
    id: "home",
    eyebrow: "Home & living",
    title: "Make every room feel complete",
    description:
      "Furniture, kitchen, and decor pieces selected for comfort and style.",
    cta: "Explore home",
    href: "/#shop",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    accent: "from-emerald-800/90 via-teal-800/80 to-cyan-700/85",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [next]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative overflow-hidden rounded-2xl border shadow-lg"
    >
      <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
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
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r",
                item.accent,
              )}
            />
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-10 lg:p-12">
              <p className="animate-in fade-in slide-in-from-bottom-2 text-xs font-bold uppercase tracking-[0.2em] text-white/85 duration-500">
                {item.eyebrow}
              </p>
              <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-2 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl duration-500">
                {item.title}
              </h1>
              <p className="animate-in fade-in slide-in-from-bottom-4 mt-3 max-w-xl text-sm leading-6 text-white/90 sm:text-base duration-500">
                {item.description}
              </p>
              <div className="animate-in fade-in slide-in-from-bottom-5 mt-6 duration-500">
                <Link
                  to={item.href}
                  className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between sm:left-5 sm:right-5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
      </div>
    </section>
  );
}
