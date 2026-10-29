import { useEffect, useState } from "react";

function CartItem({ item, updateQuantity, removeFromCart }) {
  const [quantityDraft, setQuantityDraft] = useState(String(item.quantity));
  const maxQuantity = Math.min(item.stock, 99);

  useEffect(() => setQuantityDraft(String(item.quantity)), [item.quantity]);

  function handleQuantityChange(event) {
    const value = event.target.value;
    if(value > item.stock) return;
    if (/^\d*$/.test(value) && value.length <= 2) setQuantityDraft(value);
  }

  function commitQuantity() {
    if (!quantityDraft) {
      setQuantityDraft(String(item.quantity));
      return;
    }
    const quantity = Number(quantityDraft);
    if (!Number.isInteger(quantity) || quantity < 1) {
      setQuantityDraft(String(item.quantity));
      return;
    }
    const boundedQuantity = Math.min(quantity, maxQuantity);
    updateQuantity(item.id, boundedQuantity);
    setQuantityDraft(String(boundedQuantity));
  }

  return (
    <div className="flex flex-col gap-4 border-b border-sky-100 py-5 sm:flex-row sm:items-center">
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-24 rounded-xl object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold text-zinc-900">{item.name}</h3>
        <p className="mt-1 text-zinc-600">₱{item.price.toLocaleString()}</p>
        <p className="mt-1 text-xs text-zinc-500">{item.stock} available</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          disabled={item.quantity <= 1}
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="h-9 w-9 rounded-full border border-sky-200 font-bold text-sky-700 disabled:opacity-40"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="2"
          aria-label={`${item.name} quantity`}
          value={quantityDraft}
          onChange={handleQuantityChange}
          onBlur={commitQuantity}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="field-control w-14 px-2 py-1.5 text-center text-sm font-bold"
        />
        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          disabled={item.quantity >= maxQuantity}
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="h-9 w-9 rounded-full border border-sky-200 font-bold text-sky-700 disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => removeFromCart(item.id)}
        className="text-left text-sm font-bold text-rose-500 hover:text-rose-600 sm:ml-4"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
