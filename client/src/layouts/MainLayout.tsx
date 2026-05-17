import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Navbar />

      <main className="py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
