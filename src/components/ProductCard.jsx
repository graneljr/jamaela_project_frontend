import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-500">{product.category}</p>
        <h3 className="mt-1 text-lg font-extrabold text-zinc-900">{product.name}</h3>
        <p className="mt-2 font-bold text-zinc-700">₱{product.price.toLocaleString()}</p>
        <p className="mt-1 text-sm text-zinc-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <Link to={`/product/${product.id}`} className="mt-4 inline-block text-sm font-extrabold text-sky-600 hover:text-sky-700">
          View Details →
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
