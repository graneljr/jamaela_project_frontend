import { useEffect, useState } from "react";
import { api } from "../services/api";

function AdminStock() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [addAmounts, setAddAmounts] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

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
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function updateDraft(id, field, value) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  }

  async function saveInventory(product) {
    try {
      const draft = drafts[product.id];
      if (String(draft.price).trim() === "" || String(draft.stock).trim() === "") {
        setMessage("Enter both a selling price and available quantity.");
        setError(true);
        return;
      }
      if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 0 || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) < 0) {
        setMessage("Enter a valid non-negative price and whole-number quantity.");
        setError(true);
        return;
      }
      await api.updateProductInventory(product.id, { price: Number(draft.price), stock: Number(draft.stock) });
      window.dispatchEvent(new Event("products-updated"));
      await loadProducts();
      setMessage(`${product.name} inventory updated.`);
      setError(false);
    } catch (requestError) {
      setMessage(requestError.message);
      setError(true);
    }
  }

  async function addStock(product) {
    const quantity = Number(addAmounts[product.id]);
    if (!Number.isInteger(quantity) || quantity < 1) {
      setMessage("Enter a positive whole number of units to add.");
      setError(true);
      return;
    }
    try {
      await api.addProductStock(product.id, quantity);
      window.dispatchEvent(new Event("products-updated"));
      setAddAmounts((current) => ({ ...current, [product.id]: "" }));
      await loadProducts();
      setMessage(`${quantity} units added to ${product.name}.`);
      setError(false);
    } catch (requestError) {
      setMessage(requestError.message);
      setError(true);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <p className="text-sm font-bold tracking-widest text-sky-500">INVENTORY MANAGEMENT</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Stock & Pricing</h1>
      <p className="mt-3 text-zinc-600">Add received units or edit each product’s available quantity and selling price.</p>
      {message && <p className={`mt-5 rounded-lg p-4 font-bold ${error ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-700"}`}>{message}</p>}

      {products.length === 0 && !error && <p className="mt-8 rounded-xl border border-sky-100 bg-white p-8 text-center text-zinc-600">No products found.</p>}
      <div className="mt-8 space-y-4">
        {products.map((product) => (
          <article key={product.id} className="min-w-0 rounded-xl border border-sky-100 bg-white p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <img src={product.image} alt={product.name} className="h-20 w-20 shrink-0 rounded-lg border border-sky-100 object-cover" />
              <div className="min-w-0"><h2 className="break-words font-extrabold text-zinc-900">{product.name}</h2><p className="mt-1 text-sm text-zinc-500">{product.category}</p><p className="mt-1 break-words text-sm font-bold text-zinc-600">Currently {product.stock} in stock · ₱{product.price.toLocaleString()}</p></div>
            </div>

            <div className="mt-5 min-w-0 border-t border-sky-100 pt-5">
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <label className="min-w-0 text-sm font-bold text-zinc-700">Selling price (₱)
                  <input type="number" min="0" step="0.01" value={drafts[product.id]?.price ?? product.price} onChange={(event) => updateDraft(product.id, "price", event.target.value)} className="mt-1 block w-full min-w-0 rounded-lg border border-sky-200 px-3 py-2 font-normal" />
              </label>
                <label className="min-w-0 text-sm font-bold text-zinc-700">Available quantity
                  <input type="number" min="0" step="1" value={drafts[product.id]?.stock ?? product.stock} onChange={(event) => updateDraft(product.id, "stock", event.target.value)} className="mt-1 block w-full min-w-0 rounded-lg border border-sky-200 px-3 py-2 font-normal" />
              </label>
                <button type="button" onClick={() => saveInventory(product)} className="w-full self-end rounded-full border border-sky-300 px-4 py-2 font-bold text-sky-700 hover:border-sky-500 lg:w-auto">Save changes</button>
              </div>
              <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <label className="min-w-0 text-sm font-bold text-zinc-700">Add received stock
                  <input type="number" min="1" step="1" value={addAmounts[product.id] ?? ""} onChange={(event) => setAddAmounts({ ...addAmounts, [product.id]: event.target.value })} placeholder="Units received" className="mt-1 block w-full min-w-0 rounded-lg border border-sky-200 px-3 py-2 font-normal" />
              </label>
                <button type="button" onClick={() => addStock(product)} className="w-full self-end rounded-full bg-sky-400 px-4 py-2 font-bold text-white hover:bg-sky-500 sm:w-auto">Add stock</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default AdminStock;
