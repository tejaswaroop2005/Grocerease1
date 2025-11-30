import { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const { currentUser, addToCart } = useStore(); // Destructure currentUser
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    addToCart(product);
    setTimeout(()=>setAdding(false), 700);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="h-40 w-full mb-3 overflow-hidden rounded-lg">
        <img src={product.image || "https://via.placeholder.com/400x300"} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.unit || ""}</p>
        <p className="text-sm text-gray-600 mt-1">{product.description || ""}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-green-700 font-bold text-lg">₹{product.price}</div>
        {currentUser && currentUser.role === "customer" && (
          <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleAdd}>
            {adding ? "Added" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
