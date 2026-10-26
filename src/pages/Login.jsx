import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { validateEmail } from "../utils/validation";

function Login({ onAuth, user, authLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("authToken")) {
    if (authLoading) return <main className="flex-1 px-6 py-16 text-center font-bold text-zinc-600">Loading your account…</main>;
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateEmail(email);
    if (validationMessage || !password) {
      setMessage(validationMessage || "Enter your password.");
      return;
    }
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
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10 sm:px-6 sm:py-12">
      <section className="w-full rounded-2xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100/60 sm:p-8">
        <p className="text-sm font-bold tracking-widest text-sky-500">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-zinc-700">Email
            <input required type="email" maxLength="254" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-control mt-1" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Password
            <input required type="password" autoComplete="current-password" maxLength="72" value={password} onChange={(event) => setPassword(event.target.value)} className="field-control mt-1" />
          </label>
          {message && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{message}</p>}
          <button disabled={submitting} className="min-h-12 w-full rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-md shadow-sky-200 transition hover:bg-sky-600 disabled:opacity-60">{submitting ? "Logging in…" : "Log in"}</button>
        </form>
        <p className="mt-5 text-sm text-zinc-600">New to the shop? <Link to="/register" className="font-bold text-sky-600">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
