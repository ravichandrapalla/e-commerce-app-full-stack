import { BodyText } from "./typography";
import { typography } from "../../lib/typography";
import { cn } from "../../lib/utils";

type Props = {
  title: string;
  description?: string;
  className?: string;
};

export default function EmptyState({ title, description, className }: Props) {
  return (
    <div className={cn("py-16 text-center", className)}>
      <h2 className={typography.sectionTitle}>{title}</h2>
      {description && <BodyText className="mt-2 mx-auto">{description}</BodyText>}
    </div>
  );
}
