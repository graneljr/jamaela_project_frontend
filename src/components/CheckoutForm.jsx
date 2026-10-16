import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function CheckoutForm({ cart, cartIsEmpty, clearCart, user }) {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess(false);
    if (cartIsEmpty) return setMessage("Your cart is empty.");
    if (!address.trim()) return setMessage("Please enter your delivery address.");

    try {
      await api.createOrder({ address, items: cart.map(({ id, quantity }) => ({ productId: id, quantity })) });
      setMessage("Order successfully submitted. You can track it in your dashboard.");
      setSuccess(true);
      setAddress("");
      clearCart();
    } catch (error) {
      setMessage(error.message || "Could not place your order. Please try again.");
    }
  }

  if (!user) {
    return (
      <section className="rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="text-xl font-extrabold text-zinc-900">Checkout</h2>
        <p className="mt-3 text-zinc-600">Log in or create an account to place your order.</p>
        <div className="mt-5 flex gap-3">
          <Link to="/login" className="rounded-full bg-sky-400 px-5 py-3 font-extrabold text-white hover:bg-sky-500">Log in</Link>
          <Link to="/register" className="rounded-full border border-sky-300 px-5 py-3 font-extrabold text-sky-700 hover:border-sky-500">Register</Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-sky-100 bg-white p-6">
      <h2 className="text-xl font-extrabold text-zinc-900">Checkout Details</h2>
      <p className="mt-2 text-sm text-zinc-600">Ordering as {user.fullName} ({user.email})</p>
      <label className="mt-5 block text-sm font-bold text-zinc-700">Delivery Address
        <textarea required rows="4" value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full resize-none rounded-lg border border-sky-200 bg-white px-4 py-3 font-normal outline-none focus:border-sky-400" />
      </label>
      {message && <p className={`mt-4 text-sm font-bold ${success ? "text-emerald-600" : "text-rose-500"}`}>{message}</p>}
      <button type="submit" className="mt-5 w-full rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500">Place Order</button>
    </form>
  );
}

export default CheckoutForm;
