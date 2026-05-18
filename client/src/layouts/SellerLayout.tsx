import { Outlet, NavLink } from "react-router-dom";
import { sellerLinks } from "../constants/sellerLinks";
import { cn } from "../lib/utils";
import BrandLogo from "../components/ui/BrandLogo";

export default function SellerLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[248px_1fr]">
      <aside className="border-b bg-white p-4 shadow-sm lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <BrandLogo size="sm" className="text-slate-950" />
          <h2 className="mt-1 text-2xl font-semibold">Seller hub</h2>
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2" aria-label="Seller">
          {sellerLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
