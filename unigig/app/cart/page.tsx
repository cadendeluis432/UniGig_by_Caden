"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate network delay for the checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart(); // Empty the cart on success
    }, 1500);
  };

  // 1. Show this screen if the order is complete
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#EAF6FF] flex flex-col items-center justify-center p-4 text-[#173B5E]">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-500 mb-4">Order Placed! 🎉</h1>
          <p className="text-gray-600 mb-6">This is a simulated checkout. Your order has been processed successfully.</p>
          <Link href="/unimarket" className="block w-full bg-[#2376B9] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#173B5E] transition-colors">
            Back to UniMarket
          </Link>
        </div>
      </div>
    );
  }

  // 2. Show this screen if the cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
            <Link href="/unimarket" className="text-[#2376B9] hover:underline font-semibold text-sm">
              &larr; Continue Shopping
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/unimarket" className="text-[#2376B9] font-bold hover:underline">
              Find something to buy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Show the cart items and summary
  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
          <Link href="/unimarket" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Cart Items */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_urls ? (
                    <img src={item.image_urls} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold line-clamp-1">{item.title}</h3>
                  <p className="text-[#2376B9] font-bold">₱{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₱{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Tax (Simulated)</span>
              <span className="font-semibold">₱0.00</span>
            </div>
            <div className="border-t pt-4 flex justify-between mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-[#2376B9]">₱{cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#2376B9] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#173B5E] disabled:opacity-50 transition-colors"
            >
              {isCheckingOut ? "Processing..." : "Simulate Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}