import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";

function Shop({ products }) {
  const [searchParams] = useSearchParams();
  const startingCategory = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(startingCategory);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="text-center">
        <p className="text-sm font-bold tracking-widest text-sky-500">ALL PRODUCTS</p>
        <h1 className="mt-2 text-4xl font-extrabold text-zinc-900">Our Little Shop</h1>
        <p className="mt-3 text-zinc-600">Choose something cute for your day.</p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="my-7">
        <CategoryFilter selectedCategory={category} setSelectedCategory={setCategory} />
      </div>
      <ProductGrid products={filteredProducts} />
    </main>
  );
}

export default Shop;
