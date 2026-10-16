import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";

function Home({ products }) {
  const navigate = useNavigate();

  return (
    <main>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-500">OUR FAVORITES</p>
            <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">Featured Items</h2>
          </div>
          <Link to="/shop" className="font-bold text-sky-600">See all</Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>

      <section className="border-y border-sky-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-extrabold text-zinc-900">Shop by Category</h2>
          <p className="mb-7 mt-2 text-zinc-600">Find something small to make your day a little sweeter.</p>
          <CategoryFilter hideAll selectedCategory="" setSelectedCategory={(category) => navigate(`/shop?category=${category}`)} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-sky-100 bg-white px-6 py-12 text-center">
          <p className="text-sm font-extrabold tracking-widest text-sky-600">A LITTLE CUTENESS EVERY DAY</p>
          <h2 className="mx-auto mt-3 max-w-xl text-3xl font-extrabold text-zinc-900">Simple items inspired by a soft and cloudy style.</h2>
          <Link to="/shop" className="mt-6 inline-block rounded-full border border-sky-300 bg-white px-6 py-3 font-bold text-sky-700 hover:border-sky-500">Explore Shop</Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
