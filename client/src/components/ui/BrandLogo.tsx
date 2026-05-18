import { cn } from "../../lib/utils";
import { STORE_LOGO_SRC, STORE_NAME } from "../../constants/brand";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
  size?: "sm" | "md";
};

const sizeMap = {
  sm: { image: "size-8", text: "text-base" },
  md: { image: "size-9", text: "text-lg" },
} as const;

export default function BrandLogo({
  className,
  imageClassName,
  showName = true,
  size = "md",
}: BrandLogoProps) {
  const sizes = sizeMap[size];

  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <img
        src={STORE_LOGO_SRC}
        alt={`${STORE_NAME} logo`}
        className={cn(sizes.image, "shrink-0 rounded-md object-cover", imageClassName)}
      />
      {showName && (
        <span className={cn("truncate font-semibold tracking-tight", sizes.text)}>
          {STORE_NAME}
        </span>
      )}
    </span>
  );
}
