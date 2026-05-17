import {
  useSellerOrders,
  useUpdateSellerOrderStatus,
} from "../../features/seller/seller.hooks";
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

export default function SellerOrdersPage() {
  const { data = [], isLoading } = useSellerOrders();
  const updateStatus = useUpdateSellerOrderStatus();

  if (isLoading) {
    return <div>Loading orders…</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          Fulfill orders that include your products. Buyers are notified by email on status changes.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Order</th>
              <th className="p-4 text-left text-sm font-semibold">Buyer</th>
              <th className="p-4 text-left text-sm font-semibold">Your items</th>
              <th className="p-4 text-left text-sm font-semibold">Subtotal</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
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
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.buyer.name}</p>
                    <p className="text-xs text-slate-500">{order.buyer.email}</p>
                  </td>
                  <td className="p-4 text-sm">
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.product.title} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-medium">
                    {formatCurrency(order.sellerSubtotal)}
                  </td>
                  <td className="p-4">
                    {statusLocked ? (
                      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {statusLabel[order.status]}
                      </span>
                    ) : (
                      <select
                        value={order.status}
                        disabled={updateStatus.isPending}
                        onChange={(event) =>
                          updateStatus.mutate({
                            orderId: order.id,
                            status: event.target.value as OrderStatus,
                          })
                        }
                        className="h-9 rounded-md border bg-white px-3 text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel[status]}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
