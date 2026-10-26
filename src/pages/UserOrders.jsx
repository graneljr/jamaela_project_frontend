import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Order history</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Your orders</h1><p className="mt-2 text-slate-500">Follow your purchases and see what’s on its way.</p></div>
        <Link to="/shop" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-sky-600">Continue shopping <span className="ml-2" aria-hidden="true">→</span></Link>
      </div>
      {message && <p role="alert" className="mt-6 rounded-xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{message}</p>}
      {loading && <div className="mt-7 space-y-4"><div className="h-36 animate-pulse rounded-2xl bg-white" /><div className="h-36 animate-pulse rounded-2xl bg-white" /></div>}
      {!loading && !message && orders.length === 0 && <div className="dashboard-panel mt-7 px-5 py-12 text-center sm:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-2xl text-sky-600">▣</div><h2 className="mt-4 text-lg font-extrabold text-slate-900">No orders yet</h2><p className="mt-1 text-sm text-slate-500">Your purchases will appear here once you place an order.</p><Link to="/shop" className="mt-5 inline-flex font-extrabold text-sky-700">Browse the shop <span className="ml-1" aria-hidden="true">→</span></Link></div>}
      {!loading && !message && orders.length > 0 && <div className="dashboard-panel mt-7 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-extrabold text-slate-900">Order history</h2><p className="mt-1 text-sm text-slate-500">{orders.length} {orders.length === 1 ? "order" : "orders"}</p></div>
        <p className="px-5 pt-3 text-xs text-slate-400 sm:hidden">Swipe horizontally to view all order details.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <caption className="sr-only">Your order history, including items, delivery address, and status</caption>
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-5 py-3 font-extrabold">Order</th><th scope="col" className="px-5 py-3 font-extrabold">Placed</th><th scope="col" className="px-5 py-3 font-extrabold">Items</th><th scope="col" className="px-5 py-3 font-extrabold">Delivery address</th><th scope="col" className="px-5 py-3 text-right font-extrabold">Total</th><th scope="col" className="px-5 py-3 font-extrabold">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100 bg-white">{orders.map((order) => <tr key={order._id} className="align-top transition hover:bg-slate-50/70">
              <th scope="row" className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-800">#{order._id.slice(-6).toUpperCase()}</th>
              <td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="max-w-64 px-5 py-4"><ul className="space-y-1 text-xs text-slate-600">{order.items.map((item) => <li key={item.productId}>{item.name} <span className="text-slate-400">× {item.quantity}</span></li>)}</ul></td>
              <td className="max-w-56 whitespace-normal break-words px-5 py-4 text-slate-600">{order.customer.address}</td>
              <td className="whitespace-nowrap px-5 py-4 text-right font-extrabold text-slate-800">₱{Number(order.total).toLocaleString()}</td>
              <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>}
    </main>
  );
}

function StatusBadge({ status }) {
  const tone = status === "completed" ? "bg-emerald-50 text-emerald-700" : status === "cancelled" ? "bg-rose-50 text-rose-700" : status === "shipped" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold capitalize ${tone}`}>{status}</span>;
}

export default UserOrders;
