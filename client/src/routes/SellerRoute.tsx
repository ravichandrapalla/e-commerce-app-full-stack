import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactElement } from "react";
import type { RootState } from "../store/store";
import { isSeller } from "../types/auth";

export default function SellerRoute({ children }: { children: ReactElement }) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isSeller(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
