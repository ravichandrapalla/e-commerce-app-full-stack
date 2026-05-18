import { Link } from "react-router-dom";
import {
  useAdminOrders,
  useDashboardStats,
} from "../../features/admin/admin.hooks";
import type { OrderStatus } from "../../types/ecommerce";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

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

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const { data: orders = [] } = useAdminOrders();

  const recentOrders = orders.slice(0, 5);
  const fulfillmentQueue = orders.filter((order) =>
    ["PAID", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(
      order.status,
    ),
  );

  if (isLoading || !data) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Admin overview</p>
          <h1 className="text-2xl font-semibold">Store operations</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products/approvals"
            className="inline-flex h-9 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900"
          >
            Approvals ({data.pendingApprovals ?? 0})
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm"
          >
            Review orders
          </Link>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-semibold">
            {formatCurrency(data.revenue)}
          </p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-3 text-3xl font-semibold">{data.orders}</p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Fulfillment queue</p>
          <p className="mt-3 text-3xl font-semibold text-sky-700">
            {data.pendingFulfillment}
          </p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Stock attention</p>
          <p className="mt-3 text-3xl font-semibold text-amber-700">
            {data.lowStockProducts + data.outOfStockProducts}
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-md border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.user.name} / {order.user.email}
                  </p>
                </div>
                <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {statusLabel[order.status]}
                </span>
                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Work today</h2>
          <div className="mt-4 space-y-3">
            <Link
              to="/admin/orders"
              className="block rounded-md border p-4 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold">Move fulfillment forward</p>
              <p className="mt-1 text-sm text-slate-600">
                {fulfillmentQueue.length} paid order(s) need processing or
                delivery updates.
              </p>
            </Link>
            <Link
              to="/admin/products"
              className="block rounded-md border p-4 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold">Restock inventory</p>
              <p className="mt-1 text-sm text-slate-600">
                {data.outOfStockProducts} depleted and {data.lowStockProducts} low
                stock product(s).
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
