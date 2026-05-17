import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useUpdateProduct } from "../../features/product/product.hooks";
import { useSellerProducts } from "../../features/seller/seller.hooks";
import type { Product } from "../../types/ecommerce";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const getStockBadge = (stock: number) => {
  if (stock === 0) return "bg-red-50 text-red-700 ring-red-200";
  if (stock <= 5) return "bg-amber-50 text-amber-700 ring-amber-200";
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
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
        className="h-9 w-20 rounded-md border bg-white px-2 text-sm"
        aria-label={`Restock quantity for ${product.title}`}
      />
      <button
        type="button"
        disabled={updateProduct.isPending}
        onClick={handleRestock}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        Restock
      </button>
    </div>
  );
}

export default function SellerProductsPage() {
  const { data, isLoading } = useSellerProducts();
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
    return <div>Loading your products…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage listings, stock, and visibility for your storefront.
          </p>
        </div>
        <Link
          to="/seller/products/create"
          className="inline-flex h-9 items-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white"
        >
          Add product
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Active listings</p>
          <p className="mt-2 text-3xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-md border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Low stock</p>
          <p className="mt-2 text-3xl font-semibold text-amber-700">{lowStockProducts.length}</p>
        </div>
        <div className="rounded-md border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Out of stock</p>
          <p className="mt-2 text-3xl font-semibold text-red-700">{depletedProducts.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Product</th>
              <th className="p-4 text-left text-sm font-semibold">Price</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
              <th className="p-4 text-right text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="p-4">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-slate-500">{product.category?.name}</p>
                </td>
                <td className="p-4">{formatCurrency(product.price)}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStockBadge(product.stock)}`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                  {!product.isPublished && (
                    <span className="ml-2 text-xs text-slate-500">(hidden)</span>
                  )}
                </td>
                <td className="p-4">
                  <RestockControl product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            No products yet.{" "}
            <Link to="/seller/products/create" className="font-medium text-emerald-700">
              Add your first listing
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
