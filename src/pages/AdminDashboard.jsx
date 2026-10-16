import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const emptyProduct = { name: "", category: "", price: "", stock: "", image: "", description: "" };

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  async function loadDashboard() {
    try {
      const [metrics, orderList] = await Promise.all([api.getAdminSummary(), api.getAllOrders()]);
      setSummary(metrics);
      setOrders(orderList);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function addProduct(event) {
    event.preventDefault();
    setSavingProduct(true);
    setMessage("");
    try {
      await api.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyProduct);
      window.dispatchEvent(new Event("products-updated"));
      await loadDashboard();
      setMessage("Product added to the shop.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingProduct(false);
    }
  }

  async function changeStatus(id, status) {
    try {
      await api.updateOrderStatus(id, status);
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <p className="text-sm font-bold tracking-widest text-sky-500">STORE MANAGEMENT</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Admin Dashboard</h1>
      <p className="mt-3 text-zinc-600">A quick view of shop sales, stock, and orders.</p>
      <Link to="/admin/stock" className="mt-5 inline-flex rounded-full border border-sky-300 px-5 py-2 font-bold text-sky-700 hover:border-sky-500">Open stock & pricing →</Link>
      {message && <p className="mt-5 rounded-lg bg-sky-50 p-4 font-bold text-sky-700">{message}</p>}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Completed revenue" value={`₱${(summary?.revenue || 0).toLocaleString()}`} caption="From completed orders" />
        <Metric label="Total orders" value={summary?.totalOrders ?? "—"} />
        <Metric label="Pending orders" value={summary?.pendingOrders ?? "—"} />
        <Metric label="Low stock products" value={summary?.lowStockProducts ?? "—"} caption="5 units or fewer" />
      </section>

      <section className="mt-10 rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="text-xl font-extrabold text-zinc-900">Add product</h2>
        <p className="mt-1 text-sm text-zinc-600">Use a publicly accessible image URL.</p>
        <form onSubmit={addProduct} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Product name" value={form.name} onChange={updateForm} />
          <Field name="category" label="Category" value={form.category} onChange={updateForm} />
          <Field name="price" label="Price (₱)" type="number" min="0" step="0.01" value={form.price} onChange={updateForm} />
          <Field name="stock" label="Starting stock" type="number" min="0" step="1" value={form.stock} onChange={updateForm} />
          <Field name="image" label="Image URL" type="url" value={form.image} onChange={updateForm} />
          <label className="block text-sm font-bold text-zinc-700 sm:col-span-2">Product details
            <textarea required name="description" rows="3" value={form.description} onChange={updateForm} className="mt-1 w-full resize-y rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          {form.image && <div className="sm:col-span-2"><img src={form.image} alt="Product preview" className="h-28 w-28 rounded-lg border border-sky-100 object-cover" /></div>}
          <button disabled={savingProduct} className="rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{savingProduct ? "Adding…" : "Add product"}</button>
        </form>
      </section>

      <section className="mt-10 rounded-xl border border-sky-100 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-zinc-900">Orders</h2><p className="mt-1 text-sm text-zinc-600">Update the status as each order is handled.</p></div><p className="text-sm font-bold text-zinc-500">{summary?.completedOrders ?? 0} completed</p></div>
        {orders.length === 0 && <p className="mt-6 text-zinc-600">No orders to show yet.</p>}
        <div className="mt-5 space-y-4">
          {orders.map((order) => <article key={order._id} className="rounded-lg border border-sky-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h3 className="font-extrabold">{order.customer.fullName} · #{order._id.slice(-6).toUpperCase()}</h3><p className="mt-1 text-sm text-zinc-600">{order.customer.email} · {order.customer.contact}</p><p className="mt-1 text-sm text-zinc-600">{order.customer.address}</p><p className="mt-1 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p></div>
              <label className="text-sm font-bold text-zinc-600">Status <select disabled={order.status === "cancelled"} value={order.status} onChange={(event) => changeStatus(order._id, event.target.value)} className="ml-2 rounded-lg border border-sky-200 bg-white px-3 py-2 text-zinc-800 disabled:opacity-50">{["pending", "processing", "shipped", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            </div>
            <ul className="mt-4 space-y-1 border-t border-sky-100 pt-3 text-sm text-zinc-700">{order.items.map((item) => <li key={item.productId}>{item.name} × {item.quantity} — ₱{(item.price * item.quantity).toLocaleString()}</li>)}</ul>
            <p className="mt-3 font-extrabold">Total: ₱{order.total.toLocaleString()}</p>
          </article>)}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, caption }) {
  return <article className="rounded-xl border border-sky-100 bg-white p-5"><p className="text-sm font-bold text-zinc-500">{label}</p><p className="mt-2 text-3xl font-extrabold text-sky-600">{value}</p>{caption && <p className="mt-1 text-xs text-zinc-500">{caption}</p>}</article>;
}

function Field({ name, label, type = "text", value, onChange, min, step }) {
  return <label className="block text-sm font-bold text-zinc-700">{label}<input required name={name} type={type} min={min} step={step} value={value} onChange={onChange} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" /></label>;
}

export default AdminDashboard;
