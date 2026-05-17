import { Link } from "react-router-dom";
import type { Product } from "../../types/ecommerce";
import AddToCart from "./AddToCart";

type ProductCardProps = {
  product: Product;
  animationIndex?: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const getStockCopy = (stock: number) => {
  if (stock === 0) return "Sold out";
  if (stock <= 5) return `${stock} left`;
  return "In stock";
};

const getStockClass = (stock: number) => {
  if (stock === 0) return "bg-red-50 text-red-700 ring-red-200";
  if (stock <= 5) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
};

export default function ProductCard({
  product,
  animationIndex = 0,
}: ProductCardProps) {
  return (
    <article
      style={{ animationDelay: `${Math.min(animationIndex, 12) * 45}ms` }}
      className="group animate-in fade-in zoom-in-95 slide-in-from-bottom-2 flex h-full min-w-0 flex-col overflow-hidden rounded-md border bg-white shadow-sm fill-mode-both duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:ring-1 hover:ring-slate-200"
    >
      <Link
        to={`/products/${product.id}`}
        className="block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <div className="overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl || "https://placehold.co/640x520?text=Product"}
            alt={product.title}
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {product.category?.name || "Product"}
              </p>
              <h2 className="mt-1 line-clamp-2 min-h-11 text-base font-semibold text-slate-950">
                {product.title}
              </h2>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStockClass(
                product.stock,
              )}`}
            >
              {getStockCopy(product.stock)}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
            {product.description}
          </p>
          <p className="mt-3 text-lg font-bold text-slate-950">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      <div className="mt-auto p-4 pt-1">
        <AddToCart product={product} />
      </div>
    </article>
  );
}
