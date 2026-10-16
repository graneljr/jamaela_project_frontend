function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="flex flex-col gap-4 border-b border-sky-100 py-5 sm:flex-row sm:items-center">
      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
      <div className="flex-1">
        <h3 className="font-extrabold text-zinc-900">{item.name}</h3>
        <p className="mt-1 text-zinc-600">₱{item.price.toLocaleString()}</p>
        <p className="mt-1 text-xs text-zinc-500">{item.stock} available</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-9 w-9 rounded-full border border-sky-200 font-bold text-sky-700">−</button>
        <span className="w-5 text-center font-bold">{item.quantity}</span>
        <button type="button" disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-9 w-9 rounded-full border border-sky-200 font-bold text-sky-700 disabled:opacity-40">+</button>
      </div>
      <button type="button" onClick={() => removeFromCart(item.id)} className="text-left text-sm font-bold text-rose-500 hover:text-rose-600 sm:ml-4">
        Remove
      </button>
    </div>
  );
}

export default CartItem;
