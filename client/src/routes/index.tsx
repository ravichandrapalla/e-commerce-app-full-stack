import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "./protected";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProfilePage from "../pages/ProfilePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import AdminRoute from "./AdminRoute";
import SellerRoute from "./SellerRoute";
import BuyerRoute from "./BuyerRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import RegisterPage from "../pages/RegisterPage";
import CreateProductPage from "../pages/admin/CreateProductPage";
import OrdersPage from "../pages/OrdersPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";
import CheckoutCancelPage from "../pages/CheckoutCancelPage";
import DemoCheckoutPage from "../pages/DemoCheckoutPage";
import CheckoutPage from "../pages/CheckoutPage";
import SellerLayout from "../layouts/SellerLayout";
import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import SellerProductsPage from "../pages/seller/SellerProductsPage";
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";
import SellerCreateProductPage from "../pages/seller/SellerCreateProductPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/seller",
        element: (
          <SellerRoute>
            <SellerLayout />
          </SellerRoute>
        ),
        children: [
          { index: true, element: <SellerDashboardPage /> },
          { path: "products", element: <SellerProductsPage /> },
          { path: "orders", element: <SellerOrdersPage /> },
          { path: "products/create", element: <SellerCreateProductPage /> },
        ],
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "products",
            element: <AdminProductsPage />,
          },
          {
            path: "orders",
            element: <AdminOrdersPage />,
          },
          {
            path: "products/create",
            element: <CreateProductPage />,
          },
        ],
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "/cart",
        element: (
          <BuyerRoute>
            <CartPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <BuyerRoute>
            <CheckoutPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <BuyerRoute>
            <OrdersPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/checkout/demo",
        element: (
          <BuyerRoute>
            <DemoCheckoutPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/checkout/success",
        element: (
          <BuyerRoute>
            <CheckoutSuccessPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/checkout/cancel",
        element: (
          <BuyerRoute>
            <CheckoutCancelPage />
          </BuyerRoute>
        ),
      },
    ],
  },
]);
