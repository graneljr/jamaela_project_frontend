import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar({ cartCount, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";
  const linkStyle = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-bold ${
      isActive ? "bg-sky-100 text-sky-700" : "text-zinc-600 hover:text-sky-600"
    }`;
  const drawerLinkStyle = ({ isActive }) =>
    `flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
      isActive ? "bg-sky-100 text-sky-800" : "text-zinc-600 hover:bg-sky-50 hover:text-sky-700"
    }`;

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    closeMenu();
    onLogout?.();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-sky-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-sky-600">
          <span className="text-xl">☁</span>
          <span className="hidden sm:inline">CINNAMOROLL</span>
          <span className="sm:hidden">MINI SHOP</span>
        </NavLink>

        <div className="hidden items-center justify-end gap-1 md:flex md:gap-3">
          <NavLink to="/" end className={linkStyle}>Home</NavLink>
          <NavLink to="/shop" className={linkStyle}>Shop</NavLink>
          <NavLink to="/contact" className={linkStyle}>Contact</NavLink>
          {user && <NavLink to={dashboardPath} className={linkStyle}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={linkStyle}>Profile</NavLink>}
          <NavLink to="/cart" className={linkStyle}>Cart ({cartCount})</NavLink>
          {user ? <button type="button" onClick={handleLogout} className="rounded-full px-3 py-2 text-sm font-bold text-zinc-600 hover:text-sky-600">Log out</button> : <>
            <NavLink to="/login" className={linkStyle}>Log in</NavLink>
            <NavLink to="/register" className={linkStyle}>Register</NavLink>
          </>}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-sky-100 bg-white text-sky-800 shadow-sm transition hover:bg-sky-50 md:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {menuOpen && <button type="button" aria-label="Close navigation menu" onClick={closeMenu} className="site-mobile-backdrop md:hidden" />}
      <aside
        id="site-mobile-navigation"
        aria-label="Main navigation"
        className={`site-mobile-drawer ${menuOpen ? "site-mobile-drawer-open" : ""} md:hidden`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Menu</span>
          <button type="button" onClick={closeMenu} aria-label="Close navigation menu" className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-500 hover:bg-slate-100">×</button>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={drawerLinkStyle}>Home</NavLink>
          <NavLink to="/shop" className={drawerLinkStyle}>Shop</NavLink>
          <NavLink to="/contact" className={drawerLinkStyle}>Contact</NavLink>
          {user && <NavLink to={dashboardPath} className={drawerLinkStyle}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={drawerLinkStyle}>Profile</NavLink>}
          <NavLink to="/cart" className={drawerLinkStyle}>Cart ({cartCount})</NavLink>
          <div className="my-2 border-t border-slate-100" />
          {user ? <button type="button" onClick={handleLogout} className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold text-zinc-600 transition hover:bg-rose-50 hover:text-rose-700">Log out</button> : <>
            <NavLink to="/login" className={drawerLinkStyle}>Log in</NavLink>
            <NavLink to="/register" className={drawerLinkStyle}>Register</NavLink>
          </>}
        </nav>
      </aside>
    </header>
  );
}

export default Navbar;
