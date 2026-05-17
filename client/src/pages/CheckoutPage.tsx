import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";

import PageContainer from "../components/ui/PageContainer";
import { PageHeader, BodyText } from "../components/ui/typography";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useCart } from "../hooks/useAddToCart";
import { useCheckout } from "../hooks/useCheckout";
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from "../features/order/checkout.schema";
import { copy } from "../constants/copy";
import { resolveProductImageUrl } from "../lib/productImage";
import type { RootState } from "../store/store";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: cart, isLoading } = useCart();
  const checkout = useCheckout();
  const labels = copy.checkoutPage;

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      country: "IN",
    },
  });

  useEffect(() => {
    if (user?.name) {
      reset((current) => ({ ...current, name: user.name }));
    }
  }, [user?.name, reset]);

  const onSubmit = (shipping: ShippingAddressFormValues) => {
    checkout.mutate(shipping, {
      onSuccess: (data) => {
        if (!data.checkoutUrl) return;

        try {
          const url = new URL(data.checkoutUrl, window.location.origin);
          if (url.origin === window.location.origin) {
            navigate(`${url.pathname}${url.search}`, { replace: true });
            return;
          }
        } catch {
          // fall through to external redirect
        }

        window.location.assign(data.checkoutUrl);
      },
    });
  };

  if (isLoading) {
    return (
      <PageContainer className="py-10">
        <BodyText>{copy.cart.loading}</BodyText>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer className="py-16 text-center">
        <PageHeader title={labels.emptyCart} className="mx-auto max-w-md" />
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {copy.cart.continueShopping}
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 sm:py-10">
      <PageHeader
        title={labels.title}
        description={labels.description}
        className="mb-8"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        <section className="section-surface space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">{labels.deliveryTitle}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input id="name" autoComplete="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="line1" className="text-sm font-medium">
                Address line 1
              </label>
              <Input id="line1" autoComplete="address-line1" {...register("line1")} />
              {errors.line1 && (
                <p className="text-xs text-destructive">{errors.line1.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="line2" className="text-sm font-medium">
                Address line 2 <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input id="line2" autoComplete="address-line2" {...register("line2")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <Input id="city" autoComplete="address-level2" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <Input id="state" autoComplete="address-level1" {...register("state")} />
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium">
                Postal code
              </label>
              <Input
                id="postalCode"
                autoComplete="postal-code"
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <select
                id="country"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                {...register("country")}
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
              </select>
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>
        </section>

        <aside className="section-surface h-fit space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">{labels.orderSummary}</h2>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <img
                  src={resolveProductImageUrl(item.product.imageUrl)}
                  alt=""
                  className="size-14 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.product.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button type="submit" className="w-full" disabled={checkout.isPending}>
            {checkout.isPending ? labels.processing : labels.placeOrder}
          </Button>
          <Link
            to="/cart"
            className="block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {labels.backToCart}
          </Link>
        </aside>
      </form>
    </PageContainer>
  );
}
