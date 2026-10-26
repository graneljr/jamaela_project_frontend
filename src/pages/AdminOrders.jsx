import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const statuses = ["pending", "processing", "shipped", "completed", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingOrders, setSavingOrders] = useState({});

  useEffect(() => {
    api.getAllOrders()
      .then(setOrders)
      .catch((error) => {
        setMessage(error.message);
        setFeedbackError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const searchableText = [
        order.customer.fullName,
        order.customer.email,
        order.customer.contact,
        order.customer.address,
        order._id,
        ...order.items.map((item) => item.name),
      ].join(" ").toLowerCase();
      return matchesStatus && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [orders, query, statusFilter]);

  async function changeStatus(order, status) {
    setSavingOrders((current) => ({ ...current, [order._id]: true }));
    setMessage("");
    try {
      const updatedOrder = await api.updateOrderStatus(order._id, status);
      setOrders((current) => current.map((currentOrder) => currentOrder._id === updatedOrder._id ? updatedOrder : currentOrder));
      setMessage(`Order #${order._id.slice(-6).toUpperCase()} updated to ${status}.`);
      setFeedbackError(false);
    } catch (error) {
      setMessage(error.message);
      setFeedbackError(true);
    } finally {
      setSavingOrders((current) => ({ ...current, [order._id]: false }));
    }
  }

  return (
    <main className="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Store management</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Orders</h1>
          <p className="mt-2 text-slate-500">Review customer purchases and update fulfillment status.</p>
        </div>
        <Link to="/admin" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-800">Back to overview <span className="ml-2" aria-hidden="true">→</span></Link>
      </div>

      {message && <p role={feedbackError ? "alert" : "status"} className={`mt-6 rounded-xl p-4 text-sm font-bold ${feedbackError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{message}</p>}

      <section className="dashboard-panel mt-7 overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div><h2 className="font-extrabold text-slate-900">All orders</h2><p className="mt-1 text-sm text-slate-500">{loading ? "Loading orders…" : `Showing ${filteredOrders.length} of ${orders.length} orders`}</p></div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[minmax(14rem,1fr)_12rem]">
            <label className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Search orders
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, item, address…" className="field-control mt-1 py-2.5 text-sm font-normal normal-case tracking-normal" />
            </label>
            <label className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="field-control mt-1 py-2.5 text-sm font-bold capitalize tracking-normal">
                <option value="all">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
          </div>
        </div>

        {loading && <div className="space-y-3 p-5" aria-label="Loading orders"><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="h-12 animate-pulse rounded-lg bg-slate-100" /></div>}
        {!loading && !message && filteredOrders.length === 0 && <div className="p-8 text-center sm:p-12"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-xl text-sky-600">▣</span><p className="mt-3 font-extrabold text-slate-800">{orders.length ? "No orders match these filters" : "No orders yet"}</p><p className="mt-1 text-sm text-slate-500">{orders.length ? "Try another search or status." : "Customer orders will appear here."}</p></div>}
        {!loading && filteredOrders.length > 0 && <>
          <p className="px-5 pt-3 text-xs text-slate-400 sm:hidden">Swipe horizontally to view all order details.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <caption className="sr-only">All customer orders with fulfillment status controls</caption>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-5 py-3 font-extrabold">Customer / order</th><th scope="col" className="px-5 py-3 font-extrabold">Placed</th><th scope="col" className="px-5 py-3 font-extrabold">Items</th><th scope="col" className="px-5 py-3 font-extrabold">Delivery address</th><th scope="col" className="px-5 py-3 text-right font-extrabold">Total</th><th scope="col" className="px-5 py-3 font-extrabold">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredOrders.map((order) => <tr key={order._id} className="align-top transition hover:bg-slate-50/70">
                  <th scope="row" className="min-w-52 px-5 py-4 font-normal"><span className="block font-extrabold text-slate-800">{order.customer.fullName}</span><span className="mt-1 block text-xs text-slate-500">#{order._id.slice(-6).toUpperCase()}</span><span className="mt-1 block break-all text-xs text-slate-500">{order.customer.email}</span><span className="mt-1 block text-xs text-slate-500">{order.customer.contact}</span></th>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="max-w-64 px-5 py-4"><ul className="space-y-1 text-xs text-slate-600">{order.items.map((item) => <li key={item.productId}>{item.name} <span className="text-slate-400">× {item.quantity}</span></li>)}</ul></td>
                  <td className="max-w-56 whitespace-normal break-words px-5 py-4 text-slate-600">{order.customer.address}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-extrabold text-slate-800">₱{Number(order.total).toLocaleString()}</td>
                  <td className="px-5 py-4"><label className="sr-only" htmlFor={`admin-order-status-${order._id}`}>Status for order {order._id.slice(-6).toUpperCase()}</label><select id={`admin-order-status-${order._id}`} disabled={order.status === "cancelled" || savingOrders[order._id]} value={order.status} onChange={(event) => changeStatus(order, event.target.value)} className="field-control min-w-36 py-2 text-sm font-bold capitalize text-slate-800 disabled:opacity-50">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>{savingOrders[order._id] && <span className="mt-1 block text-xs text-slate-400">Saving…</span>}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </>}
      </section>
    </main>
  );
}

export default AdminOrders;
