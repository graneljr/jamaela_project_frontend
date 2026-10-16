import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CheckoutForm from "../components/CheckoutForm";

function Cart({ cart, updateQuantity, removeFromCart, clearCart, user }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <p className="text-sm font-bold tracking-widest text-sky-500">YOUR CART</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Shopping Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          {cart.length === 0 ? (
            <div className="rounded-xl border border-sky-100 bg-white px-6 py-12 text-center">
              <p className="text-lg font-bold text-zinc-700">Your cart is empty.</p>
              <Link to="/shop" className="mt-4 inline-block font-bold text-sky-600">Visit the Shop →</Link>
            </div>
          ) : (
            cart.map((item) => <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)
          )}

          <div className="mt-7 rounded-xl border border-sky-100 p-6">
            <h2 className="text-xl font-extrabold text-zinc-900">Order Summary</h2>
            <div className="mt-4 flex justify-between text-zinc-600"><span>Items</span><span className="font-bold">{totalItems}</span></div>
            <div className="mt-3 flex justify-between border-t border-sky-100 pt-3 text-lg font-extrabold text-zinc-900"><span>Total</span><span>₱{totalPrice.toLocaleString()}</span></div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <CheckoutForm cart={cart} cartIsEmpty={cart.length === 0} clearCart={clearCart} user={user} />
        </section>
      </div>
    </main>
  );
}

export default Cart;
