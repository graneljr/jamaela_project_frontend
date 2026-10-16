import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function Profile({ user, onUserUpdate }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [contact, setContact] = useState(user.contact);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    try {
      const updatedUser = await api.updateProfile({ fullName, contact });
      onUserUpdate(updatedUser);
      setMessage("Your profile has been updated.");
      setSuccess(true);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Link to="/dashboard" className="font-bold text-sky-600">← Dashboard</Link>
      <p className="mt-6 text-sm font-bold tracking-widest text-sky-500">ACCOUNT SETTINGS</p>
      <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Your Profile</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border border-sky-100 bg-white p-6">
        <label className="block text-sm font-bold text-zinc-700">Full name
          <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
        </label>
        <label className="block text-sm font-bold text-zinc-700">Email
          <input readOnly value={user.email} className="mt-1 w-full rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 font-normal text-zinc-500" />
        </label>
        <label className="block text-sm font-bold text-zinc-700">Contact number
          <input required type="tel" value={contact} onChange={(event) => setContact(event.target.value)} className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 font-normal outline-none focus:border-sky-400" />
        </label>
        {message && <p className={`text-sm font-bold ${success ? "text-emerald-600" : "text-rose-500"}`}>{message}</p>}
        <button className="rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500">Save Profile</button>
      </form>
    </main>
  );
}

export default Profile;
