import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useCheckout";
import type { OrderStatus } from "../types/ecommerce";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const statusSteps: OrderStatus[] = [
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const statusLabel: Record<OrderStatus, string> = {
  PAYMENT_PENDING: "Payment pending",
  PENDING: "Pending",
  PAYMENT_FAILED: "Payment failed",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default function OrdersPage() {
  const { data = [], isLoading } = useOrders();

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Loading orders...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="mt-2 text-sm text-slate-600">
          Completed checkouts and demo orders will appear here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="mt-5 space-y-4">
        {data.map((order) => {
          const activeStep = Math.max(statusSteps.indexOf(order.status), 0);

          return (
            <article key={order.id} className="rounded-md border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold">Order #{order.id.slice(0, 8)}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {statusLabel[order.status]}
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-6">
                {statusSteps.map((step, index) => (
                  <div key={step} className="min-w-0">
                    <div
                      className={`h-2 rounded-full ${
                        index <= activeStep ? "bg-slate-950" : "bg-slate-200"
                      }`}
                    />
                    <p className="mt-2 truncate text-xs text-slate-500">
                      {statusLabel[step]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 divide-y rounded-md border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 p-3 text-sm">
                    <span>
                      {item.product.title} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end text-base font-semibold">
                Total: {formatCurrency(order.totalAmount)}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

