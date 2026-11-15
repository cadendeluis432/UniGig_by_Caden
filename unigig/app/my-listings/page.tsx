"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyListingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyListings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user's products
    const { data: products } = await supabase
      .from("listings")
      .select(`*, categories (name)`)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch user's gigs
    const { data: gigs } = await supabase
      .from("gigs")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    setMyProducts(products || []);
    setMyGigs(gigs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyListings();
  }, [router]);

  const handleDelete = async (type: "product" | "gig", id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this? This cannot be undone.");
    if (!confirmDelete) return;

    setDeletingId(id);

    if (type === "product") {
      await supabase.from("listings").delete().eq("id", id);
      setMyProducts(myProducts.filter(item => item.id !== id));
    } else {
      await supabase.from("gigs").delete().eq("id", id);
      setMyGigs(myGigs.filter(item => item.id !== id));
    }

    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2376B9]"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="animate-fade-up flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Listings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage everything you've posted on UniGig.</p>
          </div>
          <Link href="/marketplace" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* CREATE NEW BUTTONS */}
        <div className="animate-fade-up delay-100 flex flex-col sm:flex-row gap-4 mb-10">
          <Link 
            href="/unimarket/new" 
            className="bg-[#2376B9] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#173B5E] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-center flex-1 md:flex-none"
          >
            + Sell a Product
          </Link>
          <Link 
            href="/gigs/new" 
            className="bg-[#55A9E8] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2376B9] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-center flex-1 md:flex-none"
          >
            + Post a Gig
          </Link>
        </div>

        {/* Products Section */}
        <div className="mb-10">
          <h2 className="animate-fade-up delay-200 text-xl font-bold border-b-2 border-[#B9E0FF] pb-2 mb-4">Products for Sale ({myProducts.length})</h2>
          {myProducts.length === 0 ? (
            <div className="animate-fade-in bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
              <p className="text-gray-500 mb-4">You haven't posted any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  style={{ animationDelay: `${(index % 6) * 50}ms` }}
                  className="animate-fade-up bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-center border border-gray-100 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.image_urls ? (
                      <img src={product.image_urls} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{product.title}</h3>
                    <p className="text-[#2376B9] font-bold">₱{product.price}</p>
                    <p className="text-xs text-gray-500 truncate">{product.categories?.name || "Uncategorized"}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete("product", product.id)}
                    disabled={deletingId === product.id}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingId === product.id ? "..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gigs Section */}
        <div>
          <h2 className="animate-fade-up delay-300 text-xl font-bold border-b-2 border-[#B9E0FF] pb-2 mb-4">Gigs Offered ({myGigs.length})</h2>
          {myGigs.length === 0 ? (
            <div className="animate-fade-in bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
              <p className="text-gray-500 mb-4">You haven't posted any gigs yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myGigs.map((gig, index) => (
                <div 
                  key={gig.id} 
                  style={{ animationDelay: `${(index % 6) * 50}ms` }}
                  className="animate-fade-up bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-center border border-gray-100 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl">
                    💼
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{gig.title}</h3>
                    <p className="text-[#2376B9] font-bold">₱{gig.price}</p>
                    <p className="text-xs text-gray-500 truncate">{gig.category}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete("gig", gig.id)}
                    disabled={deletingId === gig.id}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingId === gig.id ? "..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}