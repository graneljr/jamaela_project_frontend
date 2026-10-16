function SearchBar({ search, setSearch }) {
  return (
    <input
      type="search"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search products..."
      className="w-full rounded-full border border-sky-200 bg-white px-5 py-3 text-zinc-800 outline-none focus:border-sky-400"
    />
  );
}

export default SearchBar;
