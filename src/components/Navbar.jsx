import { NavLink } from "react-router-dom";

function Navbar({ cartCount, user, onLogout }) {
  const linkStyle = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-bold ${
      isActive ? "bg-sky-100 text-sky-700" : "text-zinc-600 hover:text-sky-600"
    }`;

  return (
    <header className="sticky top-0 z-10 border-b border-sky-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-sky-600">
          <span className="text-xl">☁</span>
          <span className="hidden sm:inline">CINNAMOROLL</span>
          <span className="sm:hidden">MINI SHOP</span>
        </NavLink>

        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-3">
          <NavLink to="/" end className={linkStyle}>Home</NavLink>
          <NavLink to="/shop" className={linkStyle}>Shop</NavLink>
          <NavLink to="/contact" className={linkStyle}>Contact</NavLink>
          {user && <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={linkStyle}>Profile</NavLink>}
          <NavLink to="/cart" className={linkStyle}>Cart ({cartCount})</NavLink>
          {user ? <button type="button" onClick={onLogout} className="rounded-full px-3 py-2 text-sm font-bold text-zinc-600 hover:text-sky-600">Log out</button> : <>
            <NavLink to="/login" className={linkStyle}>Log in</NavLink>
            <NavLink to="/register" className={linkStyle}>Register</NavLink>
          </>}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
