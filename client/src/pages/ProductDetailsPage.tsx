import { Link, useParams } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import AddToCart from "../components/ui/AddToCart";
import { useProduct } from "../hooks/useProduct";
import { copy } from "../constants/copy";
import { resolveProductImageUrl } from "../lib/productImage";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const getStockCopy = (stock: number) => {
  if (stock === 0) return "Sold out";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
};

export default function ProductDetailsPage() {
  const { id = "" } = useParams();
  const { data, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="grid gap-6 py-6 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-md bg-slate-200" />
          <div className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-24 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <div className="rounded-md border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to products
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="animate-in fade-in slide-in-from-bottom-2 grid gap-6 py-2 duration-300 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:gap-10">
        <section className="overflow-hidden rounded-md border bg-white shadow-sm">
          <img
            src={resolveProductImageUrl(data.imageUrl)}
            alt={data.title}
            className="aspect-square w-full object-cover"
          />
        </section>

        <section className="rounded-md border bg-white p-5 shadow-sm sm:p-6 lg:self-start">
          <Link
            to="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Back to products
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {data.category?.name || "Product"}
            </span>
            {data.seller?.name && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                Sold by {data.seller.name}
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.stock === 0
                  ? "bg-red-50 text-red-700"
                  : data.stock <= 5
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {getStockCopy(data.stock)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            {data.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {data.description}
          </p>

          <div className="mt-6 flex flex-col gap-4 border-y py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Price</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                {formatCurrency(data.price)}
              </p>
            </div>
            <div className="w-full sm:w-56">
              <AddToCart product={data} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{copy.product.secureCheckout}</p>
              <p className="mt-1">{copy.product.secureCheckoutDescription}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{copy.product.liveInventory}</p>
              <p className="mt-1">{copy.product.liveInventoryDescription}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{copy.product.orderTracking}</p>
              <p className="mt-1">{copy.product.orderTrackingDescription}</p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
