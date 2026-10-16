import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch((error) => setMessage(error.message));
  }, []);

  const activeOrders = orders.filter((order) => ["pending", "processing", "shipped"].includes(order.status)).length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <p className="text-sm font-bold tracking-widest text-sky-500">YOUR ACCOUNT</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Hi, {user.fullName.split(" ")[0]}!</h1>
      <p className="mt-2 text-zinc-600">Here’s a quick look at your Cinnamoroll orders.</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="All orders" value={orders.length} />
        <SummaryCard label="In progress" value={activeOrders} />
        <SummaryCard label="Completed" value={completedOrders} />
      </section>

      <section className="mt-10 rounded-xl border border-sky-100 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Recent orders</h2>
            <p className="mt-1 text-sm text-zinc-600">Your latest orders and their current status.</p>
          </div>
          <Link to="/dashboard/orders" className="font-bold text-sky-600">View all orders →</Link>
        </div>
        {message && <p className="mt-5 font-bold text-rose-500">{message}</p>}
        {!message && orders.length === 0 && <p className="mt-6 rounded-lg bg-sky-50 p-5 text-zinc-600">You haven’t placed an order yet. <Link to="/shop" className="font-bold text-sky-700">Visit the shop</Link>.</p>}
        <div className="mt-5 space-y-3">
          {orders.slice(0, 3).map((order) => <OrderRow key={order._id} order={order} />)}
        </div>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-100 bg-white p-6">
        <div><h2 className="font-extrabold text-zinc-900">Your profile</h2><p className="mt-1 text-sm text-zinc-600">{user.email} · {user.contact}</p></div>
        <Link to="/profile" className="rounded-full border border-sky-300 px-5 py-2 font-bold text-sky-700 hover:border-sky-500">Edit profile</Link>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }) {
  return <div className="rounded-xl border border-sky-100 bg-white p-5"><p className="text-sm font-bold text-zinc-500">{label}</p><p className="mt-2 text-3xl font-extrabold text-sky-600">{value}</p></div>;
}

function OrderRow({ order }) {
  return <article className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-sky-100 p-4">
    <div><p className="font-extrabold">Order #{order._id.slice(-6).toUpperCase()}</p><p className="mt-1 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div>
    <div className="flex items-center gap-4"><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-bold capitalize text-sky-700">{order.status}</span><span className="font-extrabold">₱{order.total.toLocaleString()}</span></div>
  </article>;
}

export default Dashboard;
