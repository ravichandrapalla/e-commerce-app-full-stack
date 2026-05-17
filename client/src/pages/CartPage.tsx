import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart, useRemoveCartItem, useSetCartQuantity } from "../hooks/useAddToCart";
import type { RootState } from "../store/store";
import { resolveProductImageUrl } from "../lib/productImage";
import { copy } from "../constants/copy";
import PageContainer from "../components/ui/PageContainer";
import { PageHeader, BodyText } from "../components/ui/typography";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export default function CartPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useCart();
  const setQuantity = useSetCartQuantity();
  const removeItem = useRemoveCartItem();

  const items = data?.items || [];
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <PageContainer className="py-10">
        <BodyText>{copy.cart.loading}</BodyText>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <PageHeader
            title={copy.cart.emptyTitle}
            description={copy.cart.emptyDescription}
          />
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {copy.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{copy.cart.title}</h1>
            <p className="text-sm text-slate-600">{itemCount} item(s)</p>
          </div>
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-950">
            Continue shopping
          </Link>
        </div>

        <div className="divide-y rounded-md border bg-white">
          {items.map((item) => (
            <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto]">
              <img
                src={resolveProductImageUrl(item.product.imageUrl)}
                alt={item.product.title}
                className="h-24 w-24 rounded-md object-cover"
              />
              <div>
                <h2 className="font-medium">{item.product.title}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {formatCurrency(item.product.price)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.product.stock} available
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <div className="flex h-9 items-center rounded-md border">
                  <button
                    type="button"
                    className="h-full w-9 transition hover:bg-slate-100 disabled:opacity-50"
                    disabled={setQuantity.isPending}
                    onClick={() =>
                      setQuantity.mutate({
                        productId: item.productId,
                        quantity: Math.max(0, item.quantity - 1),
                      })
                    }
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="h-full w-9 transition hover:bg-slate-100 disabled:opacity-50"
                    disabled={setQuantity.isPending || item.quantity >= item.product.stock}
                    onClick={() =>
                      setQuantity.mutate({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-slate-500 transition hover:text-red-600"
                  onClick={() => removeItem.mutate({ productId: item.productId })}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-md border bg-white p-5">
        <h2 className="text-lg font-semibold tracking-tight">{copy.cart.summary}</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Shipping</span>
            <span className="font-medium">Calculated at checkout</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between border-t pt-5 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Link
          to={isAuthenticated ? "/checkout" : "/login"}
          state={isAuthenticated ? undefined : { from: "/checkout" }}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {isAuthenticated ? copy.cart.checkout : copy.cart.signInToCheckout}
        </Link>
      </aside>
    </div>
  );
}

