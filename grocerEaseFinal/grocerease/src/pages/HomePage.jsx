import { useMemo, useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard"; // Adjusted path
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams

export default function HomePage() {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); // Initialize useSearchParams
  const initialCategory = searchParams.get('category') || "All";
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams, category]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(p=>p.category)))], [products]);

  const filtered = products.filter(p => {
    const byName = p.name.toLowerCase().includes(query.toLowerCase());
    const byCat = category === "All" || p.category === category;
    return byName && byCat;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      <aside className="w-72 bg-white rounded-xl p-4 shadow h-fit">
        <h3 className="font-semibold mb-3">Categories</h3>
        <ul className="flex flex-col gap-2">
          {categories.map(c => (
            <li key={c}>
              <button className={`w-full text-left p-2 rounded ${category===c ? "bg-green-100" : "hover:bg-gray-100"}`} onClick={()=>setCategory(c)}>{c}</button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1">
        <div className="flex gap-4 items-center mb-6">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products..." className="flex-1 border p-3 rounded" />
          <div className="bg-white p-3 rounded shadow">
            <span className="text-sm text-gray-600">Showing {filtered.length} items</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  );
}
