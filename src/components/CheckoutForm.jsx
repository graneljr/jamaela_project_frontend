import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { validateAddress } from "../utils/validation";

function CheckoutForm({ cart, cartIsEmpty, clearCart, user }) {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  console.log(cart);
  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSuccess(false);
    if (cartIsEmpty) return setMessage("Your cart is empty.");
    const validationMessage = validateAddress(address);
    if (validationMessage) return setMessage(validationMessage);

    setSubmitting(true);
    try {
      await api.createOrder({
        address,
        items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
      });
      setMessage(
        "Order successfully submitted. You can track it in your dashboard.",
      );
      setSuccess(true);
      setAddress("");
      clearCart();
    } catch (error) {
      setMessage(
        error.message || "Could not place your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <section className="rounded-xl border border-sky-100 bg-white p-6">
        <h2 className="text-xl font-extrabold text-zinc-900">Checkout</h2>
        <p className="mt-3 text-zinc-600">
          Log in or create an account to place your order.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            to="/login"
            className="rounded-full bg-sky-400 px-5 py-3 font-extrabold text-white hover:bg-sky-500"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-sky-300 px-5 py-3 font-extrabold text-sky-700 hover:border-sky-500"
          >
            Register
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-panel p-5 sm:p-6">
      <h2 className="text-xl font-extrabold text-slate-900">
        Checkout details
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        Ordering as {user.fullName} ({user.email})
      </p>
      <label className="mt-5 block text-sm font-bold text-zinc-700">
        Delivery Address
        <textarea
          required
          minLength="8"
          maxLength="300"
          rows="4"
          autoComplete="street-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Street, barangay, city, province, and postal code"
          className="field-control mt-1 resize-y"
        />
        <span className="mt-1 block text-xs font-normal text-slate-400">
          {address.length}/300 characters
        </span>
      </label>
      {message && (
        <p
          role={success ? "status" : "alert"}
          className={`mt-4 rounded-lg px-3 py-2 text-sm font-bold ${success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || cartIsEmpty}
        className="mt-5 min-h-12 w-full rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

export default CheckoutForm;
