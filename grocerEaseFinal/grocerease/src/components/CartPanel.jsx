import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function CartPanel(){
  const { currentUser, getCartFor, updateQuantity, removeFromCart } = useStore();
  const nav = useNavigate();
  if (!currentUser) return null; // Still redirect if no user is logged in
  const cart = getCartFor(); // getCartFor now returns the userCart directly
  const subtotal = cart.reduce((a,b)=>a + b.price * b.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold">Your Cart</h2>
        {cart.length===0 && <div className="p-6 bg-white rounded shadow text-gray-600">Cart is empty</div>}
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4">
            <img src={item.image || "https://via.placeholder.com/96"} alt="" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.unit}</p>
              <div className="text-green-700 font-bold">₹{item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="border px-3 py-1 rounded" onClick={()=>updateQuantity(item.id, Math.max(1, item.quantity-1))}>-</button>
              <div>{item.quantity}</div>
              <button className="border px-3 py-1 rounded" onClick={()=>updateQuantity(item.id, item.quantity+1)}>+</button>
              <button className="ml-4 text-red-600" onClick={()=>removeFromCart(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <aside className="w-80 bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <div className="mt-4">
          <div className="flex justify-between text-gray-600">Subtotal <span>₹{subtotal}</span></div>
          <div className="flex justify-between text-gray-600 mt-2">Delivery <span>FREE</span></div>
          <div className="flex justify-between font-bold text-lg mt-4">Total <span>₹{subtotal}</span></div>
          <button className="w-full bg-green-600 text-white py-3 rounded mt-4" onClick={()=>nav('/checkout')}>Proceed to Checkout</button>
        </div>
      </aside>
    </div>
  );
}
