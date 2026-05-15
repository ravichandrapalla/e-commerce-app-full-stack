import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* SIDEBAR */}
      <aside className="border-r bg-white p-4">
        <h2 className="text-2xl font-bold mb-8">Admin</h2>

        <nav className="space-y-3">
          <Link to="/admin" className="block">
            Dashboard
          </Link>

          <Link to="/admin/products" className="block">
            Products
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="p-6 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
