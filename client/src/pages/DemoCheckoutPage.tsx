import { CreditCardIcon, LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useCompleteDemoCheckout } from "../hooks/useCheckout";
import { getOrderApi } from "../features/order/order.service";
import PageContainer from "../components/ui/PageContainer";
import { BodyText } from "../components/ui/typography";

const formatAddress = (order: {
  shippingName?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
}) => {
  const lines = [
    order.shippingName,
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState, order.shippingPostalCode]
      .filter(Boolean)
      .join(", "),
    order.shippingCountry,
  ].filter(Boolean);

  return lines;
};

export default function DemoCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const completeDemoCheckout = useCompleteDemoCheckout();
  const orderId = searchParams.get("order_id");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await getOrderApi(orderId!);
      return res.data;
    },
    enabled: Boolean(orderId),
  });

  const handlePay = () => {
    if (!orderId) return;

    completeDemoCheckout.mutate(orderId, {
      onSuccess: () => {
        navigate(
          `/checkout/success?provider=demo&order_id=${orderId}&completed=1`,
          { replace: true },
        );
      },
    });
  };

  const addressLines = order ? formatAddress(order) : [];

  return (
    <PageContainer className="grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <section className="section-surface">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HugeiconsIcon icon={CreditCardIcon} size={20} />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payment</p>
            <h1 className="text-2xl font-semibold tracking-tight">Complete your order</h1>
          </div>
        </div>

        {isLoading ? (
          <BodyText className="mt-6">Loading order…</BodyText>
        ) : addressLines.length > 0 ? (
          <div className="mt-6 rounded-md border bg-muted/40 p-4">
            <p className="text-sm font-medium text-foreground">Deliver to</p>
            <address className="mt-2 space-y-0.5 text-sm not-italic text-muted-foreground">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Card number</span>
            <input
              readOnly
              value="4242 4242 4242 4242"
              className="mt-1 h-11 w-full rounded-md border bg-muted/30 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Name on card</span>
            <input
              readOnly
              value={order?.shippingName || "Cardholder"}
              className="mt-1 h-11 w-full rounded-md border bg-muted/30 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Expiry</span>
            <input
              readOnly
              value="12 / 34"
              className="mt-1 h-11 w-full rounded-md border bg-muted/30 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">CVC</span>
            <input
              readOnly
              value="123"
              className="mt-1 h-11 w-full rounded-md border bg-muted/30 px-3 text-sm font-medium outline-none"
            />
          </label>
        </div>

        {completeDemoCheckout.isError && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Payment could not be completed. Please return to cart and try again.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!orderId || completeDemoCheckout.isPending}
            onClick={handlePay}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            <HugeiconsIcon icon={LockKeyIcon} size={16} />
            {completeDemoCheckout.isPending ? "Processing…" : "Pay now"}
          </button>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium transition hover:bg-muted/50"
          >
            Return to cart
          </Link>
        </div>
      </section>

      <aside className="section-surface h-fit">
        <h2 className="text-base font-semibold tracking-tight">Test payment</h2>
        <BodyText className="mt-3">
          This sandbox step confirms your order, updates inventory, and clears your cart.
          Use it when Stripe is not configured.
        </BodyText>
      </aside>
    </PageContainer>
  );
}
