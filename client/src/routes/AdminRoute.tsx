import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactElement } from "react";
import type { RootState } from "../store/store";

export default function AdminRoute({ children }: { children: ReactElement }) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}
