import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl flex-1 px-6 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-zinc-900">Product not found.</h1>
        <Link to="/shop" className="mt-5 inline-block font-bold text-sky-600">Back to Shop</Link>
      </main>
    );
  }

  function handleAddToCart() {
    if (product.stock < 1) return;
    addToCart(product, quantity);
    setMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to your cart!`);
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-16">
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white">
        <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
      </div>

      <div>
        <Link to="/shop" className="text-sm font-bold text-sky-600">← Back to Shop</Link>
        <p className="mt-6 text-sm font-extrabold uppercase tracking-widest text-sky-500">{product.category}</p>
        <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">{product.name}</h1>
        <p className="mt-4 text-2xl font-extrabold text-sky-600">₱{product.price.toLocaleString()}</p>
        <p className="mt-2 text-sm font-bold text-zinc-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-600">{product.description}</p>

        <div className="mt-8">
          <p className="mb-3 text-sm font-bold text-zinc-700">Quantity</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 rounded-full border border-sky-200 font-bold text-sky-700">−</button>
            <span className="w-6 text-center font-extrabold">{quantity}</span>
            <button type="button" disabled={quantity >= product.stock} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="h-10 w-10 rounded-full border border-sky-200 font-bold text-sky-700 disabled:opacity-40">+</button>
          </div>
        </div>

        <button type="button" disabled={product.stock < 1} onClick={handleAddToCart} className="mt-8 rounded-full bg-sky-400 px-8 py-3 font-extrabold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50">Add to Cart</button>
        {message && <p className="mt-4 font-bold text-emerald-600">{message}</p>}
      </div>
    </main>
  );
}

export default ProductDetails;
