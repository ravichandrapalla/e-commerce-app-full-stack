import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { clearUser } from "../../features/auth/auth.slice";
import { logoutApi } from "../../services/auth.service";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutApi();
    dispatch(clearUser());
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          RaviCommerce
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/products">Products</Link>

          {user && (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">Orders</Link>
            </>
          )}

          {user?.role === "ADMIN" && <Link to="/admin/products">Admin</Link>}

          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
