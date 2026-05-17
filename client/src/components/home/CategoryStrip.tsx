import { useCategories } from "../../features/category/category.hooks";
import { useQueryParams } from "../../hooks/useQueryParams";
import { copy } from "../../constants/copy";
import { SectionHeader } from "../ui/typography";
import { cn } from "../../lib/utils";

export default function CategoryStrip() {
  const { data: categories = [], isLoading } = useCategories();
  const { get, setMany } = useQueryParams();
  const activeId = get("categoryId");
  const labels = copy.home.categories;

  const selectCategory = (categoryId: string) => {
    const isActive = activeId === categoryId;
    setMany({
      categoryId: isActive ? "" : categoryId,
      page: "1",
    });

    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader
        eyebrow={labels.eyebrow}
        title={labels.title}
        actions={
          activeId ? (
            <button
              type="button"
              onClick={() =>
                setMany({
                  categoryId: "",
                  page: "1",
                })
              }
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {labels.clear}
            </button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category, index) => {
            const isActive = activeId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={cn(
                  "animate-in fade-in zoom-in-95 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 fill-mode-both",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-foreground/20 hover:shadow-sm",
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
