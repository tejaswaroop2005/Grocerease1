import { useStore } from "../context/StoreContext";

export default function CheckoutPage(){
  const { currentUser, getCartFor } = useStore();
  if (!currentUser) return null;
  const cart = getCartFor(); // Get the current user's cart
  const subtotal = cart.reduce((a,b)=>a + b.price*b.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      {cart.map(i=>(
        <div key={i.id} className="flex justify-between border-b py-2">
          <div>{i.name} x {i.quantity}</div>
          <div>₹{i.price * i.quantity}</div>
        </div>
      ))}
      <div className="flex justify-between font-bold mt-4">Total <div>₹{subtotal}</div></div>
      <div className="text-green-700 mt-4">This is a mock checkout — no payment integration.</div>
    </div>
  );
}
