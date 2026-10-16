import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto border-t border-sky-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-center text-sm text-zinc-600 sm:flex-row sm:text-left">
        <div>
          <p className="font-extrabold text-sky-600">☁ CINNAMOROLL</p>
          <p className="mt-1">© 2026 All Rigths Reserved</p>
        </div>
        <div className="flex gap-5 font-bold">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <Link to="/shop" className="hover:text-sky-600">Shop</Link>
          <Link to="/contact" className="hover:text-sky-600">Contact</Link>
          <Link to="/cart" className="hover:text-sky-600">Cart</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
