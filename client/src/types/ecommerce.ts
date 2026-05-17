export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  isPublished: boolean;
  categoryId?: string;
  category?: Category;
};

export type ProductSearchParams = {
  search?: string;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  categoryId?: string | number | null;
  inStock?: string | boolean | null;
  sort?: string | null;
  page?: string | number | null;
  limit?: string | number | null;
};

export type ProductUpdateInput = Partial<
  Pick<
    Product,
    "title" | "description" | "price" | "stock" | "categoryId" | "isPublished"
  >
>;

export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  pages: number;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PENDING"
  | "PAYMENT_FAILED"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
};

export type Order = {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  paymentProvider?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  shippingName?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  items: OrderItem[];
};

export type AdminOrder = Order & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type DashboardStats = {
  users: number;
  products: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  orders: number;
  pendingFulfillment: number;
  revenue: number;
};

export type CheckoutResponse = {
  order: Order;
  checkoutUrl?: string | null;
  paymentProvider: "stripe" | "demo";
};
