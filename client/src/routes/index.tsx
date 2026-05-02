import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "./protected";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>Home (Protected)</div>
      </ProtectedRoute>
    ),
  },
]);
