import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { isAdmin } from "../types/auth";

type EmailVerifiedRouteProps = {
  children: ReactElement;
};

export default function EmailVerifiedRoute({ children }: EmailVerifiedRouteProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  if (!user.emailVerified && !isAdmin(user.role)) {
    return (
      <Navigate
        to="/verify-email-pending"
        replace
        state={{ email: user.email }}
      />
    );
  }

  return children;
}
