import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { loginUser } = useStore();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError(""); // Clear previous errors
    const result = await loginUser(username, password);
    if (result.success) {
      nav("/home");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/mnt/data/5c34c968-2703-4ee4-a636-1e3da97dab76.png')` }}>
      <div className="bg-white/95 max-w-md w-full p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-green-700">Welcome to GrocerEase</h1>
        <p className="text-center text-sm text-gray-600 mb-6">Login or Register to start shopping</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <input className="w-full border rounded p-3 mb-3" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input className="w-full border rounded p-3 mb-4" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button className="w-full bg-green-600 text-white py-3 rounded font-semibold" onClick={submit}>Login / Register</button>

        <div className="mt-4 p-3 bg-green-50 rounded">
          <strong>Demo:</strong> admin / admin123 for admin. Any other username and password will create a new customer account.
        </div>
      </div>
    </div>
  );
}
