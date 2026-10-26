import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { validateContact, validateEmail, validateFullName, validatePassword } from "../utils/validation";

function Register({ onAuth, user, authLoading }) {
  const [form, setForm] = useState({ fullName: "", email: "", contact: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("authToken")) {
    if (authLoading) return <main className="flex-1 px-6 py-16 text-center font-bold text-zinc-600">Loading your account…</main>;
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateFullName(form.fullName) || validateEmail(form.email) || validateContact(form.contact) || validatePassword(form.password);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
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
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10 sm:px-6 sm:py-12">
      <section className="w-full rounded-2xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100/60 sm:p-8">
        <p className="text-sm font-bold tracking-widest text-sky-500">JOIN THE SHOP</p>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900">Create account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-zinc-700">Full name
            <input required minLength="2" maxLength="100" name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} className="field-control mt-1" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Email
            <input required maxLength="254" type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} className="field-control mt-1" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Contact number
            <input required type="tel" name="contact" autoComplete="tel" maxLength="24" pattern="[+0-9() .-]{7,24}" value={form.contact} onChange={updateField} className="field-control mt-1" />
          </label>
          <label className="block text-sm font-bold text-zinc-700">Password
            <input required minLength="8" maxLength="72" type="password" name="password" autoComplete="new-password" value={form.password} onChange={updateField} className="field-control mt-1" />
            <span className="mt-1 block font-normal text-zinc-500">8 to 72 characters.</span>
          </label>
          {message && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{message}</p>}
          <button disabled={submitting} className="min-h-12 w-full rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-md shadow-sky-200 transition hover:bg-sky-600 disabled:opacity-60">{submitting ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="mt-5 text-sm text-zinc-600">Already registered? <Link to="/login" className="font-bold text-sky-600">Log in</Link></p>
      </section>
    </main>
  );
}

export default Register;
