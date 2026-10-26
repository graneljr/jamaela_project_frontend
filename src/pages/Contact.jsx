const contactDetails = [
  {
    icon: "✉",
    label: "Email",
    value: "jamaela@gmail.com",
    description: "Questions about products or an order? Send us an email.",
    href: "mailto:jamaela@gmail.com",
    action: "Send an email",
  },
  {
    icon: "☎",
    label: "Phone",
    value: "Request a callback",
    description: "Email us with your phone number and a good time to reach you.",
    href: "mailto:jamaela@gmail.com?subject=Callback%20request",
    action: "Request a callback",
  },
  {
    icon: "⌖",
    label: "Location",
    value: "Online store",
    description: "Customer support is handled online. No walk-in address is listed.",
  },
  {
    icon: "◷",
    label: "Support",
    value: "Email us anytime",
    description: "Send your question whenever it’s convenient and we’ll get back to you.",
  },
];

function Contact() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-white to-indigo-50 px-6 py-10 text-center sm:px-10 sm:py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-600">We’re happy to help</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Get in touch with the Cinnamoroll shop for questions about products, orders, or anything else.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4" aria-label="Contact details">
        {contactDetails.map((detail) => (
          <article key={detail.label} className="flex min-h-60 flex-col rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/60">
            <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-xl text-sky-700">
              {detail.icon}
            </span>
            <h2 className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">{detail.label}</h2>
            <p className="mt-2 break-words text-lg font-extrabold text-slate-900">{detail.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{detail.description}</p>
            {detail.href && (
              <a href={detail.href} className="mt-auto inline-flex pt-5 text-sm font-extrabold text-sky-700 hover:text-sky-900 focus-visible:rounded focus-visible:outline-sky-500">
                {detail.action} <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            )}
          </article>
        ))}
      </section>

      <p className="mt-8 text-center text-sm text-slate-500">
        For the quickest help with an order, include your order number in your email.
      </p>
    </main>
  );
}

export default Contact;
