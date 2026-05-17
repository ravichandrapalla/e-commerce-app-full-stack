import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useCheckout";
import type { OrderStatus } from "../types/ecommerce";
import PageContainer from "../components/ui/PageContainer";
import { PageHeader, BodyText } from "../components/ui/typography";
import { copy } from "../constants/copy";

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
    return (
      <PageContainer className="py-10">
        <BodyText>{copy.orders.loading}</BodyText>
      </PageContainer>
    );
  }

  if (data.length === 0) {
    return (
      <PageContainer className="py-16 text-center">
        <PageHeader
          title={copy.orders.emptyTitle}
          description={copy.orders.emptyDescription}
          className="mx-auto max-w-md justify-center text-center [&_p]:mx-auto"
        />
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {copy.orders.continueShopping}
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 sm:py-10">
      <PageHeader title={copy.orders.title} className="mb-6" />
      <div className="space-y-4">
        {data.map((order) => {
          const activeStep = Math.max(statusSteps.indexOf(order.status), 0);

          return (
            <article key={order.id} className="section-surface">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </h2>
                  <BodyText className="mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </BodyText>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {statusLabel[order.status]}
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-6">
                {statusSteps.map((step, index) => (
                  <div key={step} className="min-w-0">
                    <div
                      className={`h-2 rounded-full ${
                        index <= activeStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    <p className="mt-2 truncate text-xs text-muted-foreground">
                      {statusLabel[step]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 divide-y rounded-md border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 p-3 text-sm">
                    <span className="text-foreground">
                      {item.product.title} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end text-base font-semibold text-foreground">
                Total: {formatCurrency(order.totalAmount)}
              </div>
            </article>
          );
        })}
      </div>
    </PageContainer>
  );
}
