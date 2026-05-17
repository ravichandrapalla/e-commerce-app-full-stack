import { Outlet, NavLink } from "react-router-dom";
import { adminLinks } from "../constants/adminLinks";
import { cn } from "../lib/utils";
import { STORE_NAME } from "../constants/brand";

export default function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[248px_1fr]">
      <aside className="border-b bg-white p-4 shadow-sm lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {STORE_NAME}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Admin</h2>
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2" aria-label="Admin">
          {adminLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
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
