import { Link, NavLink } from "react-router-dom";

function DashboardNav({ user, onLogout }) {
  const linkStyle = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-bold ${isActive ? "bg-sky-100 text-sky-700" : "text-zinc-600 hover:bg-sky-50 hover:text-sky-700"}`;

  return (
    <aside className="border-b border-sky-100 bg-white p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:p-6">
      <div className="flex items-center justify-between gap-3 md:block">
        <Link to={user?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-extrabold text-sky-700">
          <span className="text-xl">☁</span><span>ACCOUNT</span>
        </Link>
        <span className="max-w-32 truncate text-xs font-bold text-zinc-500 md:mt-3 md:block">{user?.fullName}</span>
      </div>
      <nav className="mt-4 flex flex-wrap gap-1 md:mt-8 md:flex-col">
        {user?.role === "admin" && <NavLink to="/admin" end className={linkStyle}>Admin home</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/stock" className={linkStyle}>Stock & pricing</NavLink>}
        <NavLink to="/dashboard" end className={linkStyle}>My dashboard</NavLink>
        <NavLink to="/dashboard/orders" className={linkStyle}>Orders</NavLink>
        <NavLink to="/profile" className={linkStyle}>Profile</NavLink>
      </nav>
      <div className="mt-2 flex flex-wrap gap-1 border-t border-sky-100 pt-2 md:mt-8 md:flex-col md:pt-5">
        <Link to="/shop" className={linkStyle({ isActive: false })}>Back to shop</Link>
        <button type="button" onClick={onLogout} className="rounded-lg px-3 py-2 text-left text-sm font-bold text-zinc-600 hover:bg-sky-50 hover:text-sky-700">Log out</button>
      </div>
    </aside>
  );
}

export default DashboardNav;
