import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Cancel01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";

import { clearUser } from "../../features/auth/auth.slice";
import { logoutApi } from "../../services/auth.service";
import type { RootState } from "../../store/store";
import { useCart } from "../../hooks/useAddToCart";
import { cn } from "../../lib/utils";
import UserMenu from "./UserMenu";
import UserAvatar from "./UserAvatar";
import { STORE_NAME } from "../../constants/brand";
import { copy } from "../../constants/copy";
import { isAdmin, isBuyer, isSeller } from "../../types/auth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
    isActive
      ? "bg-slate-950 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  );

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useCart(Boolean(user && isBuyer(user.role)));
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(clearUser());
    setMobileOpen(false);
  };

  const cartQuantity =
    data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMobile}
          className="flex min-w-0 items-center gap-2 rounded-md font-semibold tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
            RC
          </span>
          <span className="truncate text-lg font-semibold tracking-tight">{STORE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink to="/" end className={navLinkClass}>
            {copy.nav.home}
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            {copy.nav.products}
          </NavLink>

          {user && isBuyer(user.role) && (
            <>
              <NavLink to="/orders" className={navLinkClass}>
                {copy.nav.orders}
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  cn(navLinkClass({ isActive }), "relative inline-flex items-center gap-2")
                }
                aria-label={`Cart with ${cartQuantity} item(s)`}
              >
                <HugeiconsIcon icon={ShoppingCart01Icon} size={17} />
                {copy.nav.cart}
                {cartQuantity > 0 && (
                  <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[0.68rem] font-bold leading-5 text-white ring-2 ring-white">
                    {cartQuantity}
                  </span>
                )}
              </NavLink>
            </>
          )}

          {user && isSeller(user.role) && (
            <NavLink to="/seller" className={navLinkClass}>
              {copy.nav.seller}
            </NavLink>
          )}

          {user && isAdmin(user.role) && (
            <NavLink to="/admin" className={navLinkClass}>
              {copy.nav.admin}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              to="/login"
            >
              {copy.nav.login}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user && isBuyer(user.role) && (
            <Link
              to="/cart"
              onClick={closeMobile}
              className="relative grid size-10 place-items-center rounded-md border bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label={`Cart with ${cartQuantity} item(s)`}
            >
              <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
              {cartQuantity > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[0.68rem] font-bold leading-5 text-white ring-2 ring-white">
                  {cartQuantity}
                </span>
              )}
            </Link>
          )}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-md border bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={20} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="animate-in fade-in slide-in-from-top-2 border-t bg-white px-4 py-3 duration-200 md:hidden"
        >
          <nav className="grid gap-2" aria-label="Mobile primary">
            <NavLink to="/" end onClick={closeMobile} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={closeMobile} className={navLinkClass}>
              Products
            </NavLink>
            {user && isBuyer(user.role) && (
              <NavLink to="/orders" onClick={closeMobile} className={navLinkClass}>
                {copy.nav.orders}
              </NavLink>
            )}
            {user && isSeller(user.role) && (
              <NavLink to="/seller" onClick={closeMobile} className={navLinkClass}>
                {copy.nav.seller}
              </NavLink>
            )}
            {user && isAdmin(user.role) && (
              <NavLink to="/admin" onClick={closeMobile} className={navLinkClass}>
                {copy.nav.admin}
              </NavLink>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2">
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <NavLink to="/profile" onClick={closeMobile} className={navLinkClass}>
                  {copy.nav.profile}
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {copy.nav.logout}
                </button>
              </>
            ) : (
              <Link
                onClick={closeMobile}
                className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                to="/login"
              >
                {copy.nav.login}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
