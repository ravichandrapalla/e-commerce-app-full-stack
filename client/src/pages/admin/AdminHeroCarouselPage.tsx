import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAdminHeroSlides,
  useCreateHeroSlidesBatch,
  useDeleteHeroSlide,
  useReorderHeroSlides,
  useUpdateHeroSlide,
} from "../../features/admin/admin.hooks";
import type { HeroSlide } from "../../types/hero";
import {
  HERO_ACCENT_PRESETS,
  HERO_CAROUSEL_ASPECT_CLASS,
  HERO_IMAGE_ACCEPT,
  HERO_IMAGE_HINT,
} from "../../constants/heroCarousel";
import { validateImageFile } from "../../lib/imageUploadValidation";
import { cn } from "../../lib/utils";

type SlideDraft = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  isActive: boolean;
};

const toDraft = (slide: HeroSlide): SlideDraft => ({
  eyebrow: slide.eyebrow,
  title: slide.title,
  description: slide.description,
  cta: slide.cta,
  href: slide.href,
  accent: slide.accent,
  isActive: slide.isActive,
});

function SlideEditor({
  slide,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  slide: HeroSlide;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [draft, setDraft] = useState(() => toDraft(slide));
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(toDraft(slide));
  }, [slide]);
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();

  const appendDraft = (formData: FormData) => {
    formData.append("eyebrow", draft.eyebrow);
    formData.append("title", draft.title);
    formData.append("description", draft.description);
    formData.append("cta", draft.cta);
    formData.append("href", draft.href);
    formData.append("accent", draft.accent);
    formData.append("isActive", String(draft.isActive));
  };

  const handleSave = async () => {
    const formData = new FormData();
    appendDraft(formData);
    const file = imageInputRef.current?.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      formData.append("image", file);
    }

    try {
      await updateSlide.mutateAsync({ id: slide.id, data: formData });
      if (imageInputRef.current) imageInputRef.current.value = "";
      toast.success("Slide updated");
    } catch {
      /* axios interceptor */
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove this slide from the carousel?")) return;
    try {
      await deleteSlide.mutateAsync(slide.id);
    } catch {
      /* axios interceptor */
    }
  };

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className={cn("relative mb-4 overflow-hidden rounded-lg border", HERO_CAROUSEL_ASPECT_CLASS)}>
        <img
          src={slide.imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-r", draft.accent)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canMoveUp || updateSlide.isPending}
          onClick={onMoveUp}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Move up
        </button>
        <button
          type="button"
          disabled={!canMoveDown || updateSlide.isPending}
          onClick={onMoveDown}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Move down
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))}
          />
          Visible on home
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          value={draft.eyebrow}
          onChange={(e) => setDraft((d) => ({ ...d, eyebrow: e.target.value }))}
          placeholder="Eyebrow"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          value={draft.cta}
          onChange={(e) => setDraft((d) => ({ ...d, cta: e.target.value }))}
          placeholder="Button label"
        />
        <input
          className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Headline"
        />
        <textarea
          className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Description"
        />
        <input
          className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
          value={draft.href}
          onChange={(e) => setDraft((d) => ({ ...d, href: e.target.value }))}
          placeholder="Link (e.g. /#shop)"
        />
        <select
          className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
          value={draft.accent}
          onChange={(e) => setDraft((d) => ({ ...d, accent: e.target.value }))}
        >
          {HERO_ACCENT_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Replace image</label>
          <input
            ref={imageInputRef}
            type="file"
            accept={HERO_IMAGE_ACCEPT}
            className="w-full text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateSlide.isPending}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {updateSlide.isPending ? "Saving…" : "Save slide"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteSlide.isPending}
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default function AdminHeroCarouselPage() {
  const { data, isLoading } = useAdminHeroSlides();
  const batchUpload = useCreateHeroSlidesBatch();
  const reorder = useReorderHeroSlides();
  const batchInputRef = useRef<HTMLInputElement>(null);

  const slides = data?.slides ?? [];
  const maxSlides = data?.maxSlides ?? 8;
  const remaining = maxSlides - slides.length;

  const handleBatchUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (files.length > remaining) {
      toast.error(`You can add ${remaining} more slide(s) (max ${maxSlides})`);
      event.target.value = "";
      return;
    }

    for (const file of Array.from(files)) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        event.target.value = "";
        return;
      }
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      await batchUpload.mutateAsync(formData);
      event.target.value = "";
    } catch {
      /* axios interceptor */
    }
  };

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const orderedIds = slides.map((s) => s.id);
    [orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]];
    try {
      await reorder.mutateAsync(orderedIds);
    } catch {
      /* axios interceptor */
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hero carousel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload wide banner images for the home page carousel. Images are cropped to a 3:1
          ratio and optimized as WebP.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Upload multiple slides</h2>
        <p className="mt-1 text-sm text-slate-600">{HERO_IMAGE_HINT}</p>
        <p className="mt-2 text-sm text-slate-500">
          {slides.length} / {maxSlides} slides used
        </p>
        <input
          ref={batchInputRef}
          type="file"
          accept={HERO_IMAGE_ACCEPT}
          multiple
          disabled={remaining === 0 || batchUpload.isPending}
          onChange={handleBatchUpload}
          className="mt-4 w-full text-sm"
        />
        {remaining === 0 && (
          <p className="mt-2 text-sm text-amber-700">Maximum slides reached. Delete one to add more.</p>
        )}
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-600">Loading slides…</p>
      ) : slides.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-slate-50 p-8 text-center text-sm text-slate-600">
          No slides yet. Upload images above — default titles and copy will be applied. Edit each
          slide below after upload.
        </p>
      ) : (
        <div className="space-y-6">
          {slides.map((slide, index) => (
            <SlideEditor
              key={slide.id}
              slide={slide}
              canMoveUp={index > 0}
              canMoveDown={index < slides.length - 1}
              onMoveUp={() => moveSlide(index, -1)}
              onMoveDown={() => moveSlide(index, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
