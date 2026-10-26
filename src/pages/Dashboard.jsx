import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter((order) => ["pending", "processing", "shipped"].includes(order.status)).length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const firstName = user.fullName.trim().split(/\s+/)[0];

  return (
    <main className="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Customer overview</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Welcome back, {firstName} <span aria-hidden="true">☁</span></h1>
          <p className="mt-2 text-slate-500">Here’s what’s happening with your orders.</p>
        </div>
        <Link to="/shop" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600">Explore the shop <span className="ml-2" aria-hidden="true">↗</span></Link>
      </div>

      <section aria-label="Order summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard label="Total orders" value={loading ? "—" : orders.length} icon="▣" tone="sky" />
        <SummaryCard label="In progress" value={loading ? "—" : activeOrders} icon="◷" tone="violet" />
        <SummaryCard label="Completed" value={loading ? "—" : completedOrders} icon="✓" tone="emerald" />
      </section>

      <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]">
        <section className="dashboard-panel min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-extrabold text-slate-900">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Your latest purchases and delivery updates.</p></div>
            <Link to="/dashboard/orders" className="rounded-lg px-3 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50">View all <span aria-hidden="true">→</span></Link>
          </div>
          {message && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{message}</p>}
          {loading && <div className="mt-6 space-y-3" aria-label="Loading orders"><div className="h-16 animate-pulse rounded-xl bg-slate-100" /><div className="h-16 animate-pulse rounded-xl bg-slate-100" /></div>}
          {!loading && !message && orders.length === 0 && <div className="mt-6 rounded-2xl bg-sky-50/80 p-6 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-xl text-sky-500">☁</div><p className="mt-3 font-bold text-slate-800">Your first order is waiting</p><p className="mt-1 text-sm text-slate-500">Find something lovely in the shop.</p><Link to="/shop" className="mt-4 inline-flex font-extrabold text-sky-700">Browse products <span className="ml-1" aria-hidden="true">→</span></Link></div>}
          {!loading && !message && orders.length > 0 && <>
            <p className="mt-4 text-xs text-slate-400 sm:hidden">Swipe horizontally to view all columns.</p>
            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-100 sm:mt-5">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <caption className="sr-only">Your four most recent orders</caption>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3 font-extrabold">Order</th><th scope="col" className="px-4 py-3 font-extrabold">Placed</th><th scope="col" className="px-4 py-3 font-extrabold">Items</th><th scope="col" className="px-4 py-3 font-extrabold">Status</th><th scope="col" className="px-4 py-3 text-right font-extrabold">Total</th></tr></thead>
              <tbody className="divide-y divide-slate-100 bg-white">{orders.slice(0, 4).map((order) => <tr key={order._id} className="hover:bg-slate-50/70"><th scope="row" className="whitespace-nowrap px-4 py-4 font-extrabold text-slate-800">#{order._id.slice(-6).toUpperCase()}</th><td className="whitespace-nowrap px-4 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td className="px-4 py-4"><StatusBadge status={order.status} /></td><td className="whitespace-nowrap px-4 py-4 text-right font-extrabold text-slate-800">₱{Number(order.total).toLocaleString()}</td></tr>)}</tbody>
            </table>
            </div>
          </>}
        </section>

        <section className="dashboard-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">Account details</h2><p className="mt-1 text-sm text-slate-500">Your contact information</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-lg text-indigo-600">◉</span></div>
          <dl className="mt-6 space-y-4">
            <Detail label="Full name" value={user.fullName} />
            <Detail label="Email address" value={user.email} />
            <Detail label="Contact number" value={user.contact || "Not provided"} />
          </dl>
          <Link to="/profile" className="mt-6 flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800">Manage profile</Link>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, icon, tone }) {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };
  return <article className="dashboard-panel p-5 sm:p-6"><div className="flex items-start justify-between"><p className="text-sm font-bold text-slate-500">{label}</p><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ring-1 ${tones[tone]}`}>{icon}</span></div><p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs font-medium text-slate-400">All time</p></article>;
}

function StatusBadge({ status }) {
  const tone = status === "completed" ? "bg-emerald-50 text-emerald-700" : status === "cancelled" ? "bg-rose-50 text-rose-700" : status === "shipped" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold capitalize ${tone}`}>{status}</span>;
}

function Detail({ label, value }) {
  return <div className="min-w-0"><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</dd></div>;
}

export default Dashboard;
