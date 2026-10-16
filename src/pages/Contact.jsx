import { useState } from "react";

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

    if (Object.values(form).some((value) => value.trim() === "")) {
      setNotice("Please complete all fields.");
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
        <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">
          Have a question about our cute items? Send us a short message.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-sky-100 bg-white p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-bold text-zinc-700">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="mt-1 w-full rounded-lg border border-sky-200 bg-white px-4 py-3 font-normal outline-none focus:border-sky-400"
            />
          </label>

          <label className="block text-sm font-bold text-zinc-700">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-sky-200 bg-white px-4 py-3 font-normal outline-none focus:border-sky-400"
            />
          </label>

          <label className="block text-sm font-bold text-zinc-700">
            Message
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="mt-1 w-full resize-none rounded-lg border border-sky-200 bg-white px-4 py-3 font-normal outline-none focus:border-sky-400"
            />
          </label>

          {notice && (
            <p className={`text-sm font-bold ${success ? "text-emerald-600" : "text-rose-500"}`}>
              {notice}
            </p>
          )}

          <button type="submit" className="w-full rounded-full bg-sky-400 px-6 py-3 font-extrabold text-white hover:bg-sky-500">
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
