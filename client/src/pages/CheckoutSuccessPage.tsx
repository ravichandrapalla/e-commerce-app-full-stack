import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCompleteDemoCheckout } from "../hooks/useCheckout";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const completeDemoCheckout = useCompleteDemoCheckout();
  const submittedDemoCompletion = useRef(false);
  const provider = searchParams.get("provider");
  const orderId = searchParams.get("order_id");
  const completed = searchParams.get("completed") === "1";

  useEffect(() => {
    if (
      provider === "demo" &&
      orderId &&
      !completed &&
      !submittedDemoCompletion.current
    ) {
      submittedDemoCompletion.current = true;
      completeDemoCheckout.mutate(orderId);
    }
  }, [completeDemoCheckout, completed, orderId, provider]);

  const isFinalizing = provider === "demo" && completeDemoCheckout.isPending;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-md border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">
          {isFinalizing ? "Finalizing payment" : "Payment complete"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Thank you for your order</h1>
        <p className="mt-3 text-slate-600">
          Your order is confirmed. You can track payment, packing, shipping, and
          delivery status from the orders page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            View orders
          </Link>
          <Link
            to="/"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
