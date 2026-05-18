import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactElement } from "react";
import type { RootState } from "../store/store";
import { isBuyer } from "../types/auth";
import EmailVerifiedRoute from "./EmailVerifiedRoute";

export default function BuyerRoute({ children }: { children: ReactElement }) {
  const { user, isAuthReady } = useSelector((state: RootState) => state.auth);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isBuyer(user.role)) {
    return <Navigate to="/seller" replace />;
  }

  return <EmailVerifiedRoute>{children}</EmailVerifiedRoute>;
}
