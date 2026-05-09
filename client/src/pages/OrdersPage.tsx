import { useOrders } from "../hooks/useCheckout";

export default function OrdersPage() {
  const { data, isLoading } = useOrders();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {data.map((order: any) => (
        <div key={order.id} className="border rounded p-4">
          <div className="flex justify-between">
            <h2 className="font-semibold">Order #{order.id.slice(0, 8)}</h2>

            <span>{order.status}</span>
          </div>

          <p>Total: ₹{order.totalAmount}</p>

          <div className="mt-3 space-y-2">
            {order.items.map((item: any) => (
              <div key={item.id}>
                {item.product.title} × {item.quantity}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
