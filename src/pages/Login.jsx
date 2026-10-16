import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("authToken")) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const auth = await api.login({ email, password });
      onAuth(auth);
      navigate(auth.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <section className="rounded-2xl border border-sky-100 bg-white p-7">
        <p className="text-sm font-bold tracking-widest text-sky-500">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-zinc-700">Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Password
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          {message && <p className="text-sm font-bold text-rose-500">{message}</p>}
          <button disabled={submitting} className="w-full rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500 disabled:opacity-60">{submitting ? "Logging in…" : "Log in"}</button>
        </form>
        <p className="mt-5 text-sm text-zinc-600">New to the shop? <Link to="/register" className="font-bold text-sky-600">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
