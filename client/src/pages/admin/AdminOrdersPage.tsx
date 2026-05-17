import {
  useAdminOrders,
  useUpdateAdminOrderStatus,
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

const lockedStatuses: OrderStatus[] = ["PAYMENT_PENDING", "PAYMENT_FAILED"];
const trackableStatuses: OrderStatus[] = [
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const allowedStatusTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PAID: ["PROCESSING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "REFUNDED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
};

const getStatusOptions = (status: OrderStatus) => [
  status,
  ...(allowedStatusTransitions[status] || []),
];

export default function AdminOrdersPage() {
  const { data = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateAdminOrderStatus();

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-slate-600">
            Move paid orders through fulfillment and keep customers updated by
            email.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          {data.length} order(s)
        </span>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full">
          <caption className="sr-only">
            Admin orders table with status tracking and fulfillment controls
          </caption>
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Order</th>
              <th className="p-4 text-left text-sm font-semibold">Customer</th>
              <th className="p-4 text-left text-sm font-semibold">Total</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
              <th className="p-4 text-left text-sm font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => {
              const statusLocked = lockedStatuses.includes(order.status);
              const statusOptions = getStatusOptions(order.status);

              return (
                <tr key={order.id} className="border-b align-top last:border-0">
                  <td className="p-4">
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.items.length} item(s)
                    </p>
                    {trackableStatuses.includes(order.status) && (
                      <div className="mt-3 grid w-44 grid-cols-5 gap-1">
                        {trackableStatuses.map((status) => (
                          <span
                            key={status}
                            aria-label={statusLabel[status]}
                            className={`h-1.5 rounded-full ${
                              trackableStatuses.indexOf(status) <=
                              trackableStatuses.indexOf(order.status)
                                ? "bg-slate-950"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.user.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.user.email}
                    </p>
                  </td>
                  <td className="p-4 font-medium">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-4">
                    {statusLocked ? (
                      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {statusLabel[order.status]}
                      </span>
                    ) : (
                      <>
                        <label className="sr-only" htmlFor={`status-${order.id}`}>
                          Update status for order #{order.id.slice(0, 8)}
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={order.status}
                          disabled={updateStatus.isPending}
                          onChange={(event) =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: event.target.value as OrderStatus,
                            })
                          }
                          className="h-9 rounded-md border bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel[status]}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
