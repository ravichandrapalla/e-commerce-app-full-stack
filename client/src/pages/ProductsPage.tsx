import { useState } from "react";
import { useProducts } from "../features/product/product.hooks";
import ProductCard from "../components/ui/ProductCard";
import { useQueryParams } from "../hooks/useQueryParams";
import { useDebounce } from "../hooks/useDebounce";
import SkeletonCard from "../components/ui/SkeletonCard";

export default function ProductsPage() {
  const { get, set } = useQueryParams();

  const [searchInput, setSearchInput] = useState(get("search"));
  const debouncedSearch = useDebounce(searchInput);

  const params = {
    search: debouncedSearch,
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    page: get("page") || "1",
  };

  const { data, isLoading } = useProducts(params);

  const handleSearchChange = (e: any) => {
    setSearchInput(e.target.value);
    set("search", e.target.value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* SEARCH */}
      <input
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search products..."
        className="border px-4 py-2 rounded w-full"
      />

      {/* FILTERS */}
      <div className="flex gap-3">
        <input
          placeholder="Min Price"
          onChange={(e) => set("minPrice", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Max Price"
          onChange={(e) => set("maxPrice", e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* PRODUCTS */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {data.products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <div className="flex gap-3 mt-6">
        <button onClick={() => set("page", String(Number(params.page) - 1))}>
          Prev
        </button>

        <button onClick={() => set("page", String(Number(params.page) + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}
