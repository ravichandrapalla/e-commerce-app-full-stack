import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HERO_CAROUSEL_MAX_SLIDES } from "../../constants/heroCarousel";
import {
  createHeroSlide,
  defaultSlideCopy,
  deleteHeroSlide,
  getHeroSlideById,
  listAllHeroSlides,
  reorderHeroSlides,
  updateHeroSlide,
} from "../hero/hero.service";
import {
  heroSlideFieldsSchema,
  reorderHeroSlidesSchema,
} from "../hero/hero.validation";
import { validateImageFile } from "../../utils/validateImageFile";
import { uploadHeroImageOrRespond } from "../../utils/heroImageUpload";

export const listHeroSlides = async (_req: AuthRequest, res: Response) => {
  const slides = await listAllHeroSlides();
  res.json({ slides, maxSlides: HERO_CAROUSEL_MAX_SLIDES });
};

export const createHeroSlideHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const imageError = validateImageFile(req.file, { required: true });
    if (imageError) {
      return res.status(400).json({ message: imageError });
    }

    const upload = await uploadHeroImageOrRespond(req.file!, res);
    if (!upload.ok) return upload.response;

    const parsed = heroSlideFieldsSchema.parse(req.body);
    const slide = await createHeroSlide({
      imageUrl: upload.imageUrl,
      ...parsed,
    });

    res.status(201).json({ slide, message: "Carousel slide created" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not create slide";
    res.status(400).json({ message });
  }
};

export const createHeroSlidesBatch = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    for (const file of files) {
      const imageError = validateImageFile(file);
      if (imageError) {
        return res.status(400).json({ message: imageError });
      }
    }

    const slides = [];
    const startIndex = (await listAllHeroSlides()).length;

    for (let i = 0; i < files.length; i++) {
      const upload = await uploadHeroImageOrRespond(files[i], res);
      if (!upload.ok) return upload.response;

      const defaults = defaultSlideCopy(startIndex + i);
      const slide = await createHeroSlide({
        imageUrl: upload.imageUrl,
        ...defaults,
      });
      slides.push(slide);
    }

    res.status(201).json({
      slides,
      message: `${slides.length} slide(s) added to the carousel`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not upload slides";
    res.status(400).json({ message });
  }
};

export const updateHeroSlideHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const existing = await getHeroSlideById(req.params.id as string);
    if (!existing) {
      return res.status(404).json({ message: "Slide not found" });
    }

    let imageUrl: string | undefined;

    if (req.file) {
      const imageError = validateImageFile(req.file);
      if (imageError) {
        return res.status(400).json({ message: imageError });
      }

      const upload = await uploadHeroImageOrRespond(req.file, res);
      if (!upload.ok) return upload.response;
      imageUrl = upload.imageUrl;
    }

    const parsed = heroSlideFieldsSchema.partial().parse(req.body);
    const slide = await updateHeroSlide(existing.id, {
      ...parsed,
      ...(imageUrl ? { imageUrl } : {}),
    });

    res.json({ slide, message: "Carousel slide updated" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not update slide";
    res.status(400).json({ message });
  }
};

export const deleteHeroSlideHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const existing = await getHeroSlideById(req.params.id as string);
    if (!existing) {
      return res.status(404).json({ message: "Slide not found" });
    }

    await deleteHeroSlide(existing.id);
    res.json({ message: "Carousel slide removed" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not delete slide";
    res.status(400).json({ message });
  }
};

export const reorderHeroSlidesHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const parsed = reorderHeroSlidesSchema.parse(req.body);
    const slides = await reorderHeroSlides(parsed.orderedIds);
    res.json({ slides, message: "Carousel order updated" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not reorder slides";
    res.status(400).json({ message });
  }
};
