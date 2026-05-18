import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart, useRemoveCartItem, useSetCartQuantity } from "../hooks/useAddToCart";
import type { RootState } from "../store/store";
import { resolveProductImageUrl } from "../lib/productImage";
import { copy } from "../constants/copy";
import PageContainer from "../components/ui/PageContainer";
import { BodyText } from "../components/ui/typography";

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
      <PageContainer className="flex min-h-[calc(100dvh-10rem)] items-center justify-center py-10">
        <BodyText>{copy.cart.loading}</BodyText>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer className="flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.cart.emptyTitle}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">{copy.cart.emptyDescription}</p>
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {copy.cart.continueShopping}
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{copy.cart.title}</h1>
              <p className="text-sm text-muted-foreground">{itemCount} item(s)</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>

          <div className="divide-y rounded-md border bg-card">
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto]">
                <img
                  src={resolveProductImageUrl(item.product.imageUrl)}
                  alt={item.product.title}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <div>
                  <h2 className="font-medium">{item.product.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(item.product.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.product.stock} available
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div className="flex h-9 items-center rounded-md border">
                    <button
                      type="button"
                      className="h-full w-9 transition hover:bg-muted disabled:opacity-50"
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
                      className="h-full w-9 transition hover:bg-muted disabled:opacity-50"
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
                    className="text-sm text-muted-foreground transition hover:text-destructive"
                    onClick={() => removeItem.mutate({ productId: item.productId })}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-md border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold tracking-tight">{copy.cart.summary}</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
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
    </PageContainer>
  );
}