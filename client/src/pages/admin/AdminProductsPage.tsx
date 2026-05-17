import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import {
  useProducts,
  useUpdateProduct,
} from "../../features/product/product.hooks";
import type { Product } from "../../types/ecommerce";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const getStockBadge = (stock: number) => {
  if (stock === 0) {
    return "bg-red-50 text-red-700 ring-red-200";
  }

  if (stock <= 5) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
};

function RestockControl({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(product.stock === 0 ? 10 : 5);
  const updateProduct = useUpdateProduct();

  const handleRestock = () => {
    updateProduct.mutate({
      id: product.id,
      data: {
        stock: product.stock + quantity,
        isPublished: true,
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <label className="sr-only" htmlFor={`restock-${product.id}`}>
        Restock quantity for {product.title}
      </label>
      <input
        id={`restock-${product.id}`}
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
        className="h-9 w-20 rounded-md border bg-white px-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
      <button
        type="button"
        disabled={updateProduct.isPending}
        onClick={handleRestock}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:translate-y-0 disabled:opacity-60"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        Restock
      </button>
    </div>
  );
}

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 50,
  });

  const products = data?.products || [];
  const depletedProducts = useMemo(
    () => products.filter((product) => product.stock === 0),
    [products],
  );
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock > 0 && product.stock <= 5),
    [products],
  );

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Replenish existing items here instead of creating duplicates.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Active products</p>
          <p className="mt-2 text-3xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-md border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Low stock</p>
          <p className="mt-2 text-3xl font-semibold text-amber-700">
            {lowStockProducts.length}
          </p>
        </div>
        <div className="rounded-md border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Depleted</p>
          <p className="mt-2 text-3xl font-semibold text-red-700">
            {depletedProducts.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full">
          <caption className="sr-only">
            Product inventory with inline restock controls
          </caption>
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Product</th>
              <th className="p-4 text-left text-sm font-semibold">Price</th>
              <th className="p-4 text-left text-sm font-semibold">Stock</th>
              <th className="p-4 text-right text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b align-middle transition hover:bg-slate-50 last:border-0"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/96x96?text=Product"
                      }
                      alt=""
                      className="size-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStockBadge(
                      product.stock,
                    )}`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </td>
                <td className="p-4">
                  <RestockControl product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
