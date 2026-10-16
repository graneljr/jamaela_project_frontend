import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <p className="mb-3 text-sm font-extrabold tracking-widest text-sky-600">SWEET &amp; SOFT COLLECTION</p>
          <h1 className="text-4xl font-extrabold leading-tight text-zinc-900 sm:text-5xl">
            Cute little things for your everyday favorites.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-zinc-600 md:mx-0">
            Discover simple, cloud-soft items inspired by the gentle and cheerful style of Cinnamoroll.
          </p>
          <Link to="/shop" className="mt-7 inline-block rounded-full bg-sky-400 px-7 py-3 font-bold text-white hover:bg-sky-500">
            Shop Now
          </Link>
        </div>

        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border-8 border-white bg-white shadow-sm">
          <img src="/products/plush.png" alt="Cute white puppy plush" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
