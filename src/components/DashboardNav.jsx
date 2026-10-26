import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function DashboardNav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const homePath = user?.role === "admin" ? "/admin" : "/dashboard";
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
      isActive
        ? "bg-sky-100 text-sky-800 shadow-sm"
        : "text-slate-600 hover:bg-sky-50 hover:text-sky-800"
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

  function NavigationLinks() {
    return (
      <>
        <p className="px-3 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        {user?.role === "admin" && <NavLink to="/admin" end className={linkStyle}><span aria-hidden="true">▦</span>Overview</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/orders" className={linkStyle}><span aria-hidden="true">▣</span>Orders</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/stock" className={linkStyle}><span aria-hidden="true">▤</span>Inventory</NavLink>}
        {user?.role !== "admin" && <NavLink to="/dashboard" end className={linkStyle}><span aria-hidden="true">⌂</span>My dashboard</NavLink>}
        {user?.role !== "admin" && <NavLink to="/dashboard/orders" className={linkStyle}><span aria-hidden="true">▣</span>Orders</NavLink>}
        <NavLink to="/profile" className={linkStyle}><span aria-hidden="true">◉</span>Profile</NavLink>
        <div className="my-3 border-t border-slate-100" />
        <Link to="/shop" className={linkStyle}><span aria-hidden="true">↗</span>Back to shop</Link>
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"><span aria-hidden="true">↪</span>Log out</button>
      </>
    );
  }

  return (
    <>
      <header className="dashboard-mobile-header md:hidden">
        <Link to={homePath} className="flex min-w-0 items-center gap-3 font-extrabold text-sky-800">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-100 text-xl text-sky-600">☁</span>
          <span className="truncate">{user?.role === "admin" ? "Store workspace" : "My workspace"}</span>
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="dashboard-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-sky-50"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </header>

      {menuOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/35 md:hidden" />}
      <aside
        id="dashboard-mobile-navigation"
        className={`dashboard-sidebar ${menuOpen ? "dashboard-sidebar-open" : ""}`}
      >
        <div className="mb-2 flex items-center justify-between md:hidden">
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Navigation</span>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu" className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-500 hover:bg-slate-100">×</button>
        </div>
        <Link to={homePath} className="hidden items-center gap-3 px-2 py-2 md:flex">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-2xl text-sky-600">☁</span>
          <span><span className="block text-sm font-extrabold text-slate-900">Cinnamoroll</span><span className="block text-xs font-semibold text-slate-400">{user?.role === "admin" ? "Store admin" : "Customer space"}</span></span>
        </Link>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 md:mt-8">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-200 to-indigo-100 font-extrabold text-sky-800">{user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "U"}</span>
          <span className="min-w-0"><span className="block truncate text-sm font-extrabold text-slate-800">{user?.fullName}</span><span className="block text-xs capitalize text-slate-500">{user?.role || "customer"}</span></span>
        </div>
        <nav className="mt-5 flex flex-col gap-1 md:mt-7"><NavigationLinks /></nav>
        <p className="mt-auto hidden px-3 pt-8 text-xs text-slate-400 md:block">Made for a little more joy ☁</p>
      </aside>
    </>
  );
}

export default DashboardNav;
