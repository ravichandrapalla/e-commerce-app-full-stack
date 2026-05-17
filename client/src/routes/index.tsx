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
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/demo",
        element: (
          <ProtectedRoute>
            <DemoCheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/success",
        element: (
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/cancel",
        element: (
          <ProtectedRoute>
            <CheckoutCancelPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
