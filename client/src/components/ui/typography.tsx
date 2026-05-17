import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { typography } from "../../lib/typography";

type HeadingTag = "h1" | "h2" | "h3";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  titleAs?: HeadingTag;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  titleAs: TitleTag = "h1",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && <p className={typography.eyebrow}>{eyebrow}</p>}
        <TitleTag className={typography.pageTitle}>{title}</TitleTag>
        {description && <p className={typography.lead}>{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  titleAs?: HeadingTag;
  size?: "page" | "section";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  titleAs: TitleTag = "h2",
  size = "section",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && <p className={typography.eyebrow}>{eyebrow}</p>}
        <TitleTag
          className={size === "page" ? typography.pageTitle : typography.sectionTitle}
        >
          {title}
        </TitleTag>
        {description && <p className={typography.lead}>{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(typography.eyebrow, className)} {...props} />;
}

export function Lead({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(typography.lead, className)} {...props} />;
}

export function BodyText({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(typography.body, className)} {...props} />;
}
