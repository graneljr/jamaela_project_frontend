import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Register({ onAuth }) {
  const [form, setForm] = useState({ fullName: "", email: "", contact: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("authToken")) return <Navigate to="/dashboard" replace />;

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const auth = await api.register(form);
      onAuth(auth);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <section className="rounded-2xl border border-sky-100 bg-white p-7">
        <p className="text-sm font-bold tracking-widest text-sky-500">JOIN THE SHOP</p>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900">Create account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-zinc-700">Full name
            <input required name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Email
            <input required type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Contact number
            <input required type="tel" name="contact" autoComplete="tel" value={form.contact} onChange={updateField} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Password
            <input required minLength="8" type="password" name="password" autoComplete="new-password" value={form.password} onChange={updateField} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
            <span className="mt-1 block font-normal text-zinc-500">At least 8 characters.</span>
          </label>
          {message && <p className="text-sm font-bold text-rose-500">{message}</p>}
          <button disabled={submitting} className="w-full rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500 disabled:opacity-60">{submitting ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="mt-5 text-sm text-zinc-600">Already registered? <Link to="/login" className="font-bold text-sky-600">Log in</Link></p>
      </section>
    </main>
  );
}

export default Register;
