import { useCategories } from "../../features/category/category.hooks";
import { useQueryParams } from "../../hooks/useQueryParams";
import { cn } from "../../lib/utils";

export default function CategoryStrip() {
  const { data: categories = [], isLoading } = useCategories();
  const { get, setMany } = useQueryParams();
  const activeId = get("categoryId");

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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Shop by category
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Browse what matters to you
          </h2>
        </div>
        {activeId && (
          <button
            type="button"
            onClick={() =>
              setMany({
                categoryId: "",
                page: "1",
              })
            }
            className="shrink-0 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
          >
            Clear category
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category, index) => {
            const isActive = activeId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={cn(
                  "animate-in fade-in zoom-in-95 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 fill-mode-both",
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm",
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
