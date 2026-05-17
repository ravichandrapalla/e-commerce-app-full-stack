import { CreditCardIcon, LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCompleteDemoCheckout } from "../hooks/useCheckout";

export default function DemoCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const completeDemoCheckout = useCompleteDemoCheckout();
  const orderId = searchParams.get("order_id");

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

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <section className="rounded-md border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white">
            <HugeiconsIcon icon={CreditCardIcon} size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-500">Demo checkout</p>
            <h1 className="text-2xl font-semibold">Pay with test card</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Card number</span>
            <input
              readOnly
              value="4242 4242 4242 4242"
              className="mt-1 h-11 w-full rounded-md border bg-slate-50 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Name on card</span>
            <input
              readOnly
              value="Ravi Commerce"
              className="mt-1 h-11 w-full rounded-md border bg-slate-50 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Expiry</span>
            <input
              readOnly
              value="12 / 34"
              className="mt-1 h-11 w-full rounded-md border bg-slate-50 px-3 text-sm font-medium outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">CVC</span>
            <input
              readOnly
              value="123"
              className="mt-1 h-11 w-full rounded-md border bg-slate-50 px-3 text-sm font-medium outline-none"
            />
          </label>
        </div>

        {completeDemoCheckout.isError && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Payment could not be completed. Please return to cart and try again.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!orderId || completeDemoCheckout.isPending}
            onClick={handlePay}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <HugeiconsIcon icon={LockKeyIcon} size={16} />
            {completeDemoCheckout.isPending ? "Processing..." : "Pay demo order"}
          </button>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium transition hover:bg-slate-50"
          >
            Return to cart
          </Link>
        </div>
      </section>

      <aside className="h-fit rounded-md border bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold">Payment mode</h2>
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">Sandbox card</p>
          <p className="mt-1 text-sm text-emerald-700">
            This confirms the order, reduces inventory, clears the cart, and keeps
            the flow usable without Stripe keys.
          </p>
        </div>
      </aside>
    </div>
  );
}
