import { useState } from "react";
import { useStore } from "../context/StoreContext";
import AddProductForm from "../components/AddProductForm";
import EditProductModal from "../components/EditProductModal"; // Import the new modal

export default function AdminPage() {
  const { products, deleteProduct } = useStore();
  const [showAdder, setShowAdder] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleSaveEdit = () => {
    // No specific action needed here as AddProductForm handles the update and refreshes products
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Admin Panel</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={()=>setShowAdder(s=>!s)}>
          {showAdder ? "Close Add Form" : "+ Add New Product"}
        </button>
      </div>

      {showAdder && <div className="mb-6"><AddProductForm onDone={()=>setShowAdder(false)} /></div>}

      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-6">
            <img src={p.image || "https://via.placeholder.com/120"} alt="" className="w-28 h-28 object-cover rounded" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.category} • {p.unit}</p>
              <p className="text-gray-600 mt-1">{p.description}</p>
            </div>
            <div className="text-right">
              <div className="text-green-700 font-bold">₹{p.price}</div>
              <div className="text-sm text-gray-600">Stock: {p.stock}</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 border rounded" onClick={() => handleEditClick(p)}>Edit</button>
                <button className="px-3 py-2 border rounded text-red-600" onClick={()=>deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <EditProductModal
          product={editingProduct}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
