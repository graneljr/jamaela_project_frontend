import { useEffect, useState } from "react";
import { api } from "../services/api";

function AdminStock() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [addAmounts, setAddAmounts] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState({});
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const rows = await api.getAdminProducts();
      setProducts(rows);
      setDrafts(Object.fromEntries(rows.map((product) => [product.id, { price: product.price, stock: product.stock }])));
      setMessage("");
      setError(false);
    } catch (requestError) {
      setMessage(requestError.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function updateDraft(id, field, value) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  }

  function updateStockDraft(id, value) {
    if (/^\d*$/.test(value) && value.length <= 7) updateDraft(id, "stock", value);
  }

  function updateStockAmount(id, value) {
    if (/^\d*$/.test(value) && value.length <= 7) setAddAmounts((current) => ({ ...current, [id]: value }));
  }

  async function saveInventory(product) {
    try {
      const draft = drafts[product.id];
      if (String(draft.price).trim() === "" || String(draft.stock).trim() === "") {
        setMessage("Enter both a selling price and available quantity.");
        setError(true);
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(String(draft.price).trim()) || !Number.isFinite(Number(draft.price)) || Number(draft.price) > 99999999 || !/^\d+$/.test(String(draft.stock).trim()) || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) > 1000000) {
        setMessage("Price must be up to ₱99,999,999 with 2 decimals. Stock must be a whole number from 0 to 1,000,000.");
        setError(true);
        return;
      }
      setSaving((current) => ({ ...current, [product.id]: "inventory" }));
      await api.updateProductInventory(product.id, { price: Number(draft.price), stock: Number(draft.stock) });
      window.dispatchEvent(new Event("products-updated"));
      await loadProducts();
      setMessage(`${product.name} inventory updated.`);
      setError(false);
    } catch (requestError) {
      setMessage(requestError.message);
      setError(true);
    } finally {
      setSaving((current) => ({ ...current, [product.id]: "" }));
    }
  }

  async function addStock(product) {
    const quantity = Number(addAmounts[product.id]);
    if (!/^\d+$/.test(String(addAmounts[product.id] || "").trim()) || !Number.isInteger(quantity) || quantity < 1 || product.stock + quantity > 1000000) {
      setMessage("Enter a whole number of units that keeps total stock at or below 1,000,000.");
      setError(true);
      return;
    }
    try {
      setSaving((current) => ({ ...current, [product.id]: "stock" }));
      await api.addProductStock(product.id, quantity);
      window.dispatchEvent(new Event("products-updated"));
      setAddAmounts((current) => ({ ...current, [product.id]: "" }));
      await loadProducts();
      setMessage(`${quantity} units added to ${product.name}.`);
      setError(false);
    } catch (requestError) {
      setMessage(requestError.message);
      setError(true);
    } finally {
      setSaving((current) => ({ ...current, [product.id]: "" }));
    }
  }

  return (
    <main className="dashboard-page">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Inventory management</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Stock & pricing</h1><p className="mt-2 max-w-2xl text-slate-500">Review product availability, update prices, and record new stock as it arrives.</p></div>
      <div className="mt-6 flex flex-wrap gap-3"><div className="dashboard-panel flex items-center gap-3 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 font-bold text-sky-700">▤</span><span><span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Products</span><span className="text-lg font-black text-slate-800">{products.length}</span></span></div><div className="dashboard-panel flex items-center gap-3 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 font-bold text-amber-700">!</span><span><span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Low stock</span><span className="text-lg font-black text-slate-800">{products.filter((product) => product.stock <= 5).length}</span></span></div></div>
      {message && <p role={error ? "alert" : "status"} className={`mt-5 rounded-xl p-4 text-sm font-bold ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{message}</p>}

      {loading && <p className="dashboard-panel mt-8 p-6 text-sm text-slate-500">Loading inventory…</p>}
      {!loading && products.length === 0 && !error && <p className="dashboard-panel mt-8 p-8 text-center text-slate-500">No products found.</p>}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="dashboard-panel min-w-0 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <img src={product.image} alt={product.name} className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-cover" />
              <div className="min-w-0 flex-1"><h2 className="break-words font-extrabold text-slate-900">{product.name}</h2><p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{product.category}</p><p className="mt-2 break-words text-sm font-bold text-slate-600">₱{Number(product.price).toLocaleString()}</p></div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${product.stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{product.stock <= 5 ? "Low stock" : "In stock"} · {product.stock}</span>
            </div>

            <div className="mt-5 min-w-0 border-t border-slate-100 pt-5">
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <label className="min-w-0 text-sm font-bold text-zinc-700">Selling price (₱)
                  <input required type="number" min="0" max="99999999" step="0.01" value={drafts[product.id]?.price ?? product.price} onChange={(event) => updateDraft(product.id, "price", event.target.value)} className="field-control mt-1 min-w-0 py-2" />
              </label>
                <label className="min-w-0 text-sm font-bold text-zinc-700">Available quantity
                  <input required type="text" inputMode="numeric" pattern="[0-9]*" maxLength="7" minLength="1" value={drafts[product.id]?.stock ?? product.stock} onChange={(event) => updateStockDraft(product.id, event.target.value)} className="field-control mt-1 min-w-0 py-2" />
              </label>
                <button type="button" disabled={Boolean(saving[product.id])} onClick={() => saveInventory(product)} className="min-h-10 w-full self-end rounded-xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 disabled:opacity-50 lg:w-auto">{saving[product.id] === "inventory" ? "Saving…" : "Save changes"}</button>
              </div>
              <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <label className="min-w-0 text-sm font-bold text-zinc-700">Add received stock
                  <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="7" value={addAmounts[product.id] ?? ""} onChange={(event) => updateStockAmount(product.id, event.target.value)} placeholder="Units received" className="field-control mt-1 min-w-0 py-2" />
              </label>
                <button type="button" disabled={Boolean(saving[product.id])} onClick={() => addStock(product)} className="min-h-10 w-full self-end rounded-xl bg-sky-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-sky-600 disabled:opacity-50 sm:w-auto">{saving[product.id] === "stock" ? "Adding…" : "Add stock"}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default AdminStock;
