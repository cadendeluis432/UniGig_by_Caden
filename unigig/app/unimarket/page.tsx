"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function UniMarketPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);

  // Try to safely get the cart
  let cart: any[] = [];
  try {
    const cartContext = useCart();
    cart = cartContext.cart;
  } catch (e) {
    // Ignore error if provider is missing during initial load
  }

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      const { data } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
    };
    initPage();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      
      let query = supabase
        .from("listings")
        .select(`
          id, title, price, condition, status,
          categories (name)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (searchQuery.trim() !== "") {
        query = query.ilike("title", `%${searchQuery.trim()}%`);
      }

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching listings:", JSON.stringify(error, null, 2));
      } else {
        setListings(data || []);
      }
      
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="animate-fade-in min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-[#173B5E] font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="animate-fade-up flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">UniMarket</h1>
            {isLoggedIn ? (
              <Link href="/marketplace" className="inline-flex items-center text-[#2376B9] hover:text-[#173B5E] font-semibold text-sm mt-1 transition-colors">
                <span className="mr-1">&larr;</span> Back to Dashboard
              </Link>
            ) : (
              <Link href="/" className="inline-flex items-center text-[#2376B9] hover:text-[#173B5E] font-semibold text-sm mt-1 transition-colors">
                <span className="mr-1">&larr;</span> Back to Home
              </Link>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {isLoggedIn && (
              <>
                <Link href="/cart" className="group w-full sm:w-auto text-center bg-white border border-gray-200 text-[#173B5E] px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                  Cart 🛒
                  {cart.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full group-hover:scale-110 transition-transform">
                      {cart.length}
                    </span>
                  )}
                </Link>

                <Link href="/unimarket/new" className="w-full sm:w-auto text-center bg-[#2376B9] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#173B5E] shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  + Sell a Product
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="animate-fade-up delay-100 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2376B9]/20 transition-all text-[#173B5E] placeholder:text-gray-400"
            />
          </div>
          
          <div className="h-px w-full md:h-auto md:w-px bg-gray-100 my-1 md:my-0"></div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50/50 border-0 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2376B9]/20 text-[#173B5E] font-medium w-full md:w-auto md:min-w-[200px] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 shadow-sm border border-gray-100 p-4 flex flex-col">
                <div className="bg-gray-200 h-40 rounded-xl mb-4 w-full"></div>
                <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded mb-6"></div>
                <div className="bg-gray-200 h-8 w-1/3 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="animate-fade-in text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#173B5E] mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">We couldn't find anything matching your search.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="bg-[#EAF6FF] text-[#2376B9] px-6 py-2 rounded-lg font-semibold hover:bg-[#B9E0FF] transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item, index) => (
              <Link 
                href={`/unimarket/${item.id}`} 
                key={item.id} 
                style={{ animationDelay: `${(index % 8) * 50}ms` }}
                className="animate-fade-up bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                  {item.image_urls ? (
                    <img src={item.image_urls} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🛍️</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-[#173B5E] shadow-sm">
                    {item.condition}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-[#2376B9] mb-1 uppercase tracking-wider">
                    {item.categories?.name || "Uncategorized"}
                  </p>
                  <h3 className="text-lg font-bold text-[#173B5E] line-clamp-1 mb-4 group-hover:text-[#2376B9] transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-2xl font-extrabold text-[#173B5E] mt-auto">
                    ₱{item.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}