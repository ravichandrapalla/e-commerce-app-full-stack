import { Link } from "react-router-dom";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-md border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-amber-700">Checkout cancelled</p>
        <h1 className="mt-2 text-3xl font-semibold">Your cart is still saved</h1>
        <p className="mt-3 text-slate-600">
          You can review quantities, remove items, and start checkout again when
          you are ready.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/cart"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Return to cart
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

