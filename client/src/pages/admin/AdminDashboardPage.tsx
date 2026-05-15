import { useDashboardStats } from "../../features/admin/admin.hooks";

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-slate-500">Users</h3>
        <p className="text-3xl font-bold">{data.users}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-slate-500">Products</h3>
        <p className="text-3xl font-bold">{data.products}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-slate-500">Orders</h3>
        <p className="text-3xl font-bold">{data.orders}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-slate-500">Revenue</h3>
        <p className="text-3xl font-bold">₹{data.revenue}</p>
      </div>
    </div>
  );
}
