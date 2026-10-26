import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { validateContact, validateFullName } from "../utils/validation";

function Profile({ user, onUserUpdate }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [contact, setContact] = useState(user.contact);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    const validationMessage = validateFullName(fullName) || validateContact(contact);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    setSaving(true);
    try {
      const updatedUser = await api.updateProfile({ fullName, contact });
      onUserUpdate(updatedUser);
      setMessage("Your profile has been updated.");
      setSuccess(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-sm font-extrabold text-sky-700 hover:text-sky-900">← Dashboard</Link>
      <div className="mt-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">Account settings</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Your profile</h1><p className="mt-2 text-slate-500">Keep your contact details current for delivery updates.</p></div>
      <form onSubmit={handleSubmit} className="dashboard-panel mt-7 max-w-2xl space-y-5 p-5 sm:p-7">
        <label className="block text-sm font-bold text-zinc-700">Full name
          <input required minLength="2" maxLength="100" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="field-control mt-1" />
        </label>
        <label className="block text-sm font-bold text-zinc-700">Email
          <input readOnly value={user.email} className="field-control mt-1" />
        </label>
        <label className="block text-sm font-bold text-zinc-700">Contact number
          <input required type="tel" autoComplete="tel" maxLength="24" pattern="[+0-9() .-]{7,24}" value={contact} onChange={(event) => setContact(event.target.value)} className="field-control mt-1" />
        </label>
        {message && <p role={success ? "status" : "alert"} className={`rounded-lg px-3 py-2 text-sm font-bold ${success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{message}</p>}
        <button disabled={saving} className="min-h-11 rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white transition hover:bg-sky-600 disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </main>
  );
}

export default Profile;
