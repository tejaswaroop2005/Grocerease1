import { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function AddProductForm({ initial = {}, onDone }) {
  const { addNewProduct, updateProduct } = useStore();
  const [form, setForm] = useState({
    name: initial.name || "",
    price: initial.price || "",
    category: initial.category || "",
    unit: initial.unit || "",
    stock: initial.stock || "",
    image: initial.image || "",
    description: initial.description || "",
  });
  const [preview, setPreview] = useState(form.image || null);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(f);
  };

  const submit = () => {
    const product = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      image: form.image,
      description: form.description,
    };
    if (initial.id) {
      updateProduct(initial.id, product);
    } else {
      addNewProduct(product);
    }
    if (onDone) onDone();
    setForm({ name: "", price: "", category: "", unit: "", stock: "", image: "", description: "" });
    setPreview(null);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Product Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Unit (per kg, per dozen)" value={form.unit} onChange={(e)=>setForm({...form,unit:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Image URL (optional)" value={form.image && form.image.startsWith('data:') ? '' : form.image} onChange={(e)=>setForm({...form,image:e.target.value})} />
        <input type="file" accept="image/*" onChange={handleImage} className="col-span-2" />
        <textarea className="border p-2 rounded col-span-2" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      </div>

      {preview && <img src={preview} className="h-36 w-36 object-cover mt-3 rounded" />}

      <div className="mt-4 flex gap-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submit}>Add Product</button>
        <button className="px-4 py-2 rounded border" onClick={()=>{ setForm({name:'',price:'',category:'',unit:'',stock:'',image:'',description:''}); setPreview(null); }}>Reset</button>
      </div>
    </div>
  );
}
