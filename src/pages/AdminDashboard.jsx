import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { validateProduct } from "../utils/validation";

const emptyProduct = { name: "", category: "", price: "", stock: "", image: "", description: "" };

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [metrics, orderList] = await Promise.all([api.getAdminSummary(), api.getAllOrders()]);
      setSummary(metrics);
      setOrders(orderList);
      setMessage("");
      setFeedbackError(false);
    } catch (error) {
      setMessage(error.message);
      setFeedbackError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function addProduct(event) {
    event.preventDefault();
    const validationMessage = validateProduct(form);
    if (validationMessage) {
      setMessage(validationMessage);
      setFeedbackError(true);
      return;
    }
    setSavingProduct(true);
    setMessage("");
    try {
      await api.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyProduct);
      window.dispatchEvent(new Event("products-updated"));
      await loadDashboard();
      setMessage("Product added to the shop.");
      setFeedbackError(false);
    } catch (error) {
      setMessage(error.message);
      setFeedbackError(true);
    } finally {
      setSavingProduct(false);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Store management</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Admin overview</h1><p className="mt-2 text-slate-500">Monitor store performance, products, and incoming orders.</p></div>
        <Link to="/admin/stock" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-800">Manage inventory <span className="ml-2" aria-hidden="true">→</span></Link>
      </div>
      {message && <p role={feedbackError ? "alert" : "status"} className={`mt-5 rounded-xl p-4 text-sm font-bold ${feedbackError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{message}</p>}

      <section aria-label="Store metrics" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Completed revenue" value={summary ? `₱${Number(summary.revenue).toLocaleString()}` : "—"} caption="From completed orders" icon="₱" tone="emerald" />
        <Metric label="Total orders" value={summary?.totalOrders ?? "—"} caption="All order statuses" icon="▣" tone="sky" />
        <Metric label="Pending orders" value={summary?.pendingOrders ?? "—"} caption="Need attention" icon="◷" tone="amber" />
        <Metric label="Low stock products" value={summary?.lowStockProducts ?? "—"} caption="5 units or fewer" icon="▤" tone="violet" />
      </section>

      <section className="dashboard-panel mt-7 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">Add a product</h2><p className="mt-1 text-sm text-slate-500">Add a new item to the storefront catalog.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-lg text-sky-700">＋</span></div>
        <form onSubmit={addProduct} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Product name" value={form.name} onChange={updateForm} maxLength="100" autoComplete="off" />
          <Field name="category" label="Category" value={form.category} onChange={updateForm} maxLength="40" autoComplete="off" />
          <Field name="price" label="Price (₱)" type="number" min="0" max="99999999" step="0.01" value={form.price} onChange={updateForm} />
          <Field name="stock" label="Starting stock" type="number" min="0" max="1000000" step="1" value={form.stock} onChange={updateForm} />
          <Field name="image" label="Image URL" type="url" value={form.image} onChange={updateForm} maxLength="2048" />
          <label className="block text-sm font-bold text-zinc-700 sm:col-span-2">Product details
            <textarea required name="description" rows="3" maxLength="1000" value={form.description} onChange={updateForm} className="field-control mt-1 resize-y" />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.description.length}/1,000</span>
          </label>
          {form.image && <div className="sm:col-span-2"><img src={form.image} alt="Product preview" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} onLoad={(event) => { event.currentTarget.style.visibility = "visible"; }} className="h-28 w-28 rounded-xl border border-slate-200 object-cover" /></div>}
          <button disabled={savingProduct} className="min-h-11 rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-wait disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{savingProduct ? "Adding product…" : "Add product"}</button>
        </form>
      </section>

      <section className="dashboard-panel mt-7 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">Recent orders</h2><p className="mt-1 text-sm text-slate-500">The latest customer purchases.</p></div><div className="flex items-center gap-2"><p className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">{summary?.completedOrders ?? 0} completed</p><Link to="/admin/orders" className="rounded-lg px-3 py-2 text-sm font-extrabold text-sky-700 transition hover:bg-sky-50">View all orders →</Link></div></div>
        {!loading && orders.length === 0 && <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No orders to show yet.</p>}
        {loading && <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Loading store data…</p>}
        {!loading && orders.length > 0 && <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Five most recent customer orders</caption>
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3 font-extrabold">Order / customer</th><th scope="col" className="px-4 py-3 font-extrabold">Placed</th><th scope="col" className="px-4 py-3 font-extrabold">Items</th><th scope="col" className="px-4 py-3 text-right font-extrabold">Total</th><th scope="col" className="px-4 py-3 font-extrabold">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100 bg-white">{orders.slice(0, 5).map((order) => <tr key={order._id} className="align-top transition hover:bg-slate-50/70">
              <th scope="row" className="min-w-48 px-4 py-4 font-normal"><span className="block font-extrabold text-slate-800">#{order._id.slice(-6).toUpperCase()}</span><span className="mt-1 block text-xs text-slate-500">{order.customer.fullName}</span></th>
              <td className="whitespace-nowrap px-4 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="max-w-64 px-4 py-4"><ul className="space-y-1 text-xs text-slate-600">{order.items.map((item) => <li key={item.productId}>{item.name} <span className="text-slate-400">× {item.quantity}</span></li>)}</ul></td>
              <td className="whitespace-nowrap px-4 py-4 text-right font-extrabold text-slate-800">₱{Number(order.total).toLocaleString()}</td>
              <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </section>
    </main>
  );
}

function Metric({ label, value, caption, icon, tone }) {
  const tones = { sky: "bg-sky-50 text-sky-700", violet: "bg-violet-50 text-violet-700", amber: "bg-amber-50 text-amber-700", emerald: "bg-emerald-50 text-emerald-700" };
  return <article className="dashboard-panel p-5"><div className="flex items-start justify-between gap-3"><p className="text-sm font-bold text-slate-500">{label}</p><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${tones[tone]}`}>{icon}</span></div><p className="mt-4 break-words text-3xl font-black tracking-tight text-slate-900">{value}</p>{caption && <p className="mt-1 text-xs text-slate-400">{caption}</p>}</article>;
}

function StatusBadge({ status }) {
  const tone = status === "completed" ? "bg-emerald-50 text-emerald-700" : status === "cancelled" ? "bg-rose-50 text-rose-700" : status === "shipped" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold capitalize ${tone}`}>{status}</span>;
}

function Field({ name, label, type = "text", value, onChange, min, max, step, maxLength, autoComplete }) {
  return <label className="block text-sm font-bold text-slate-700">{label}<input required name={name} type={type} min={min} max={max} step={step} maxLength={maxLength} autoComplete={autoComplete} value={value} onChange={onChange} className="field-control mt-1" /></label>;
}

export default AdminDashboard;
