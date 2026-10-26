import { useState } from "react";
import { validateEmail, validateFullName } from "../utils/validation";

function Contact() {
  const emptyForm = { name: "", email: "", message: "" };
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSuccess(false);

    const validationMessage = validateFullName(form.name) || validateEmail(form.email);
    if (validationMessage || form.message.trim().length < 10 || form.message.trim().length > 2000) {
      setNotice(validationMessage || "Message must be between 10 and 2,000 characters.");
      return;
    }

    setNotice("Thank you! Your message has been received.");
    setSuccess(true);
    setForm(emptyForm);
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="text-center">
        <p className="text-sm font-bold tracking-widest text-sky-500">SAY HELLO</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">
          Have a question about our cute items? Send us a short message.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100/50 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-bold text-zinc-700">
            Name
            <input
              type="text"
              name="name"
              required
              minLength="2"
              maxLength="100"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="field-control mt-1"
            />
          </label>

          <label className="block text-sm font-bold text-zinc-700">
            Email
            <input
              type="email"
              name="email"
              required
              maxLength="254"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="field-control mt-1"
            />
          </label>

          <label className="block text-sm font-bold text-zinc-700">
            Message
            <textarea
              name="message"
              required
              minLength="10"
              maxLength="2000"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="field-control mt-1 resize-y"
            />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.message.length}/2,000</span>
          </label>

          {notice && (
            <p role={success ? "status" : "alert"} className={`rounded-lg px-3 py-2 text-sm font-bold ${success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {notice}
            </p>
          )}

          <button type="submit" className="min-h-12 w-full rounded-xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-sky-600">
            Send Message
          </button>
        </form>

        <div className="mt-6 border-t border-sky-200 pt-5 text-center text-sm text-zinc-600">
          <p className="font-bold text-zinc-800">Cinnamoroll</p>
          <p className="mt-1">jamaela@gmail.com</p>
        </div>
      </div>
    </main>
  );
}

export default Contact;
