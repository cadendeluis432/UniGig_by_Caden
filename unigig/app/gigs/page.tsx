"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function GigsPage() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    initPage();
  }, []);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      
      let query = supabase
        .from("gigs")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (searchQuery.trim() !== "") {
        query = query.or(`title.ilike.%${searchQuery.trim()}%,category.ilike.%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching gigs:", JSON.stringify(error, null, 2));
      } else {
        setGigs(data || []);
      }
      
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchGigs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="animate-fade-in min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-[#173B5E] font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="animate-fade-up flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Student Gigs</h1>
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
          
          <Link 
            href="/gigs/new" 
            className="w-full md:w-auto text-center bg-[#2376B9] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#173B5E] shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            + Post a Gig
          </Link>
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
              placeholder="Search for gigs, services, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2376B9]/20 transition-all text-[#173B5E] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Gigs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-64 shadow-sm border border-gray-100 p-5 flex flex-col">
                <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 w-1/3 rounded mb-6"></div>
                <div className="bg-gray-200 h-16 w-full rounded mb-4"></div>
                <div className="bg-gray-200 h-8 w-1/4 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="animate-fade-in text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#173B5E] mb-2">No gigs found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any gigs matching your search.</p>
            <button onClick={() => setSearchQuery("")} className="bg-[#EAF6FF] text-[#2376B9] px-6 py-2 rounded-lg font-semibold hover:bg-[#B9E0FF] transition-colors">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig, index) => (
              <Link 
                href={`/gigs/${gig.id}`} 
                key={gig.id} 
                style={{ animationDelay: `${(index % 8) * 50}ms` }}
                className="animate-fade-up bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden transform hover:-translate-y-2"
              >
                {/* NEW: Stylized Top Area (Like an image, but using a gradient and icon) */}
                <div className="relative h-36 w-full bg-gradient-to-br from-[#EAF6FF] to-[#B9E0FF] flex items-center justify-center overflow-hidden border-b border-blue-100">
                   <span className="text-5xl opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-md">💼</span>
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#2376B9] shadow-sm uppercase tracking-wide">
                    {gig.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#173B5E] line-clamp-1 mb-2 group-hover:text-[#2376B9] transition-colors">
                    {gig.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-5">
                    {gig.description}
                  </p>

                  {/* Price with an accent color */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-semibold uppercase">Starting at</span>
                    <span className="text-xl font-extrabold text-[#2376B9]">
                      ₱{gig.price}
                    </span>
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