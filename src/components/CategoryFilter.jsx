const categories = ["All", "Plushies", "Accessories", "Stationery", "Home"];

function CategoryFilter({ selectedCategory, setSelectedCategory, hideAll = false }) {
  const shownCategories = hideAll ? categories.slice(1) : categories;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {shownCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setSelectedCategory?.(category)}
          className={`rounded-full border px-5 py-2 text-sm font-bold ${
            selectedCategory === category
              ? "border-sky-400 bg-sky-400 text-white"
              : "border-sky-100 bg-white text-zinc-700 hover:border-sky-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
