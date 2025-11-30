import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./context/StoreContext";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import IntroHomePage from "./pages/IntroHomePage"; // Import new IntroHomePage

import HomePage from "./pages/HomePage"; // Corrected import for HomePage
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { currentUser } = useStore();

  return (
    <BrowserRouter>
      {/* show navbar only when logged in */}
      {currentUser && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={currentUser ? <IntroHomePage /> : <Navigate to="/login" />} /> {/* Render IntroHomePage for /home */}
        <Route path="/products" element={currentUser ? <HomePage /> : <Navigate to="/login" />} /> {/* New route for products */}
        <Route path="/cart" element={currentUser ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={currentUser ? <CheckoutPage /> : <Navigate to="/login" />} />

        {/* admin protected route */}
        <Route
          path="/admin"
          element={
            currentUser && currentUser.role === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
