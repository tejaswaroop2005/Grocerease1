import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { currentUser, logoutUser, getCartFor } = useStore();
  const nav = useNavigate();
  const cart = getCartFor(); // Get the current user's cart
  const cartCount = cart.reduce((a,b)=>a+b.quantity,0);

  const handleLogout = () => {
    logoutUser();
    nav("/");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xl">G</div>
          <div className="text-2xl font-semibold text-green-700">GrocerEase</div>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="text-green-700 font-medium">Products</Link>

          {currentUser && currentUser.role === "admin" && (
            <Link to="/admin" className="text-green-700 font-medium">Admin Panel</Link>
          )}

          <Link to="/cart" className="relative">
            <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4"></path></svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1.5">{cartCount}</span>
            )}
          </Link>

          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{currentUser.username}</div>
              <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
