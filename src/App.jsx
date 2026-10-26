import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardNav from "./components/DashboardNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import UserOrders from "./pages/UserOrders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminStock from "./pages/AdminStock";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { api, clearAuth, getStoredToken, saveAuth } from "./services/api";

function App() {
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => api.getProducts().then(setProducts).catch(() => setProducts([]));
    const handleExpiredAuth = () => setUser(null);
    loadProducts();
    window.addEventListener("products-updated", loadProducts);
    window.addEventListener("auth-expired", handleExpiredAuth);
    if (!getStoredToken()) {
      setAuthLoading(false);
      return () => {
        window.removeEventListener("products-updated", loadProducts);
        window.removeEventListener("auth-expired", handleExpiredAuth);
      };
    }
    api.getMe().then(setUser).catch(() => {
      clearAuth();
      setUser(null);
    }).finally(() => setAuthLoading(false));
    return () => {
      window.removeEventListener("products-updated", loadProducts);
      window.removeEventListener("auth-expired", handleExpiredAuth);
    };
  }, []);

  function handleAuth(auth) {
    saveAuth(auth);
    setUser(auth.user);
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  function handleUserUpdate(updatedUser) {
    setUser(updatedUser);
  }

  function addToCart(product, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const maxQuantity = Math.min(product.stock, 99);
    if (maxQuantity < 1) return;
    setCart((currentCart) => {
      const itemAlreadyInCart = currentCart.find(
        (item) => item.id === product.id,
      );

      if (itemAlreadyInCart) {
        const nextQuantity = Math.min(itemAlreadyInCart.quantity + quantity, maxQuantity);
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: Math.min(quantity, maxQuantity) }];
    });
  }

  function updateQuantity(id, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stock, 99) } : item,
      ),
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const dashboardArea = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin") || location.pathname === "/profile";
  const routes = (
    <Routes>
      <Route path="/" element={<Home products={products} />} />
      <Route path="/shop" element={<Shop products={products} />} />
      <Route
        path="/product/:id"
        element={<ProductDetails products={products} addToCart={addToCart} />}
      />
      <Route
        path="/cart"
        element={
          <Cart
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={() => setCart([])}
            user={user}
          />
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login onAuth={handleAuth} user={user} authLoading={authLoading} />} />
      <Route path="/register" element={<Register onAuth={handleAuth} user={user} authLoading={authLoading} />} />
      <Route path="/dashboard" element={authLoading ? <Loading /> : !user ? <Navigate to="/login" replace /> : user.role === "admin" ? <Navigate to="/admin" replace /> : <Dashboard user={user} />} />
      <Route path="/dashboard/orders" element={authLoading ? <Loading /> : !user ? <Navigate to="/login" replace /> : user.role === "admin" ? <Navigate to="/admin" replace /> : <UserOrders />} />
      <Route path="/profile" element={authLoading ? <Loading /> : user ? <Profile user={user} onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" replace />} />
      <Route path="/admin" element={authLoading ? <Loading /> : !user ? <Navigate to="/login" replace /> : user.role !== "admin" ? <Navigate to="/dashboard" replace /> : <AdminDashboard />} />
      <Route path="/admin/orders" element={authLoading ? <Loading /> : !user ? <Navigate to="/login" replace /> : user.role !== "admin" ? <Navigate to="/dashboard" replace /> : <AdminOrders />} />
      <Route path="/admin/stock" element={authLoading ? <Loading /> : !user ? <Navigate to="/login" replace /> : user.role !== "admin" ? <Navigate to="/dashboard" replace /> : <AdminStock />} />
    </Routes>
  );

  return (
    <div className="flex min-h-screen flex-col font-sans text-zinc-900">
      {dashboardArea ? (
        <div className="dashboard-shell flex min-h-screen flex-1 flex-col md:flex-row">
          <DashboardNav user={user} onLogout={handleLogout} />
          <div className="dashboard-content min-w-0 flex-1">{routes}</div>
        </div>
      ) : (
        <>
          <Navbar cartCount={cartCount} user={user} onLogout={handleLogout} />
          {routes}
          <Footer />
        </>
      )}
    </div>
  );
}

function Loading() {
  return <main className="flex-1 px-6 py-16 text-center font-bold text-zinc-600">Loading your account…</main>;
}

export default App;
