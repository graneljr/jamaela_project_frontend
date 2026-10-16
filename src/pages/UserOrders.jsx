import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch((error) => setMessage(error.message));
  }, []);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <Link to="/dashboard" className="font-bold text-sky-600">← Dashboard</Link>
      <p className="mt-6 text-sm font-bold tracking-widest text-sky-500">ORDER HISTORY</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Your Orders</h1>
      {message && <p className="mt-5 rounded-lg bg-rose-50 p-4 font-bold text-rose-600">{message}</p>}
      {!message && orders.length === 0 && <p className="mt-8 rounded-xl border border-sky-100 p-8 text-center text-zinc-600">No orders yet. <Link to="/shop" className="font-bold text-sky-600">Browse the shop</Link>.</p>}
      <div className="mt-8 space-y-4">
        {orders.map((order) => <article key={order._id} className="rounded-xl border border-sky-100 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-extrabold">Order #{order._id.slice(-6).toUpperCase()}</h2><p className="mt-1 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-bold capitalize text-sky-700">{order.status}</span></div>
          <ul className="mt-4 space-y-1 text-sm text-zinc-700">{order.items.map((item) => <li key={item.productId}>{item.name} × {item.quantity} — ₱{(item.price * item.quantity).toLocaleString()}</li>)}</ul>
          <p className="mt-4 border-t border-sky-100 pt-3 font-extrabold">Total: ₱{order.total.toLocaleString()}</p>
        </article>)}
      </div>
    </main>
  );
}

export default UserOrders;
