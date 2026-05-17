import { type ChangeEvent, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterHorizontalIcon,
  Search01Icon,
  FilterResetIcon,
} from "@hugeicons/core-free-icons";

import { useProducts } from "../../features/product/product.hooks";
import { useCategories } from "../../features/category/category.hooks";
import ProductCard from "../ui/ProductCard";
import SkeletonCard from "../ui/SkeletonCard";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDebounce } from "../../hooks/useDebounce";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "stock_desc", label: "Most available" },
];

type ProductCatalogProps = {
  compactHeader?: boolean;
};

export default function ProductCatalog({ compactHeader = false }: ProductCatalogProps) {
  const { get, set, setMany } = useQueryParams();
  const { data: categories = [] } = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(get("search"));

  const debouncedSearch = useDebounce(searchInput);
  const params = {
    search: debouncedSearch,
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    categoryId: get("categoryId"),
    inStock: get("inStock"),
    sort: get("sort") || "newest",
    page: get("page") || "1",
    limit: 12,
  };

  const { data, isLoading } = useProducts(params);
  const page = Number(params.page || 1);
  const pages = data?.pages || 1;
  const products = data?.products || [];
  const hasFilters = Boolean(
    params.search ||
      params.minPrice ||
      params.maxPrice ||
      params.categoryId ||
      params.inStock,
  );

  const activeFilterCount = useMemo(
    () =>
      [
        params.search,
        params.minPrice || params.maxPrice,
        params.categoryId,
        params.inStock,
      ].filter(Boolean).length,
    [params.categoryId, params.inStock, params.maxPrice, params.minPrice, params.search],
  );

  const updateFilter = (key: string, value: string) => {
    setMany({
      [key]: value,
      page: "1",
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setMany({
      search: "",
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      inStock: "",
      sort: "",
      page: "",
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    updateFilter("search", event.target.value);
  };

  return (
    <section
      id="shop"
      className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-3 duration-500"
    >
      <section className="rounded-md border bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            {!compactHeader && (
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Catalog
              </p>
            )}
            <h2
              className={
                compactHeader
                  ? "text-2xl font-semibold text-slate-950"
                  : "mt-2 max-w-2xl text-3xl font-semibold text-slate-950 sm:text-4xl"
              }
            >
              {compactHeader
                ? "All products"
                : "Find the right product without fighting the interface"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search first, refine only when needed, and keep the page fast for a
              growing catalog.
            </p>
          </div>

          <div className="space-y-3">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <div className="flex h-12 items-center gap-2 rounded-md border bg-slate-50 px-3 transition focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200">
              <HugeiconsIcon icon={Search01Icon} size={18} />
              <input
                id="product-search"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <HugeiconsIcon icon={FilterResetIcon} size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="animate-in fade-in slide-in-from-top-1 mt-5 grid gap-3 border-t pt-5 duration-200 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Category</span>
              <select
                value={params.categoryId}
                onChange={(event) => updateFilter("categoryId", event.target.value)}
                className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Min price</span>
              <input
                inputMode="numeric"
                value={params.minPrice}
                onChange={(event) => updateFilter("minPrice", event.target.value)}
                placeholder="0"
                className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Max price</span>
              <input
                inputMode="numeric"
                value={params.maxPrice}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                placeholder="5000"
                className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Sort</span>
              <select
                value={params.sort}
                onChange={(event) => updateFilter("sort", event.target.value)}
                className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-1">
              <input
                type="checkbox"
                checked={params.inStock === "true"}
                onChange={(event) =>
                  updateFilter("inStock", event.target.checked ? "true" : "")
                }
                className="size-4 rounded border-slate-300"
              />
              In stock only
            </label>
          </div>
        )}
      </section>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {isLoading ? "Loading products..." : `${data?.total || 0} product(s) found`}
        </p>
        <p className="text-sm text-slate-500">
          Page {page} of {pages}
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} animationIndex={index} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-md border bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold">No matching products</h3>
          <p className="mt-2 text-sm text-slate-600">
            Try clearing filters or searching for a broader term.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => set("page", String(page - 1))}
          className="h-10 rounded-md border bg-white px-4 text-sm font-medium transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="min-w-24 text-center text-sm text-slate-600">
          {page} / {pages}
        </span>

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => set("page", String(page + 1))}
          className="h-10 rounded-md border bg-white px-4 text-sm font-medium transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
