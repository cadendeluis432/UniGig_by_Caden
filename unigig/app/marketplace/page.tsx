"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function MarketplacePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [studentName, setStudentName] = useState("");
  
  // Stats state
  const [listingCount, setListingCount] = useState(0);
  const [gigCount, setGigCount] = useState(0);
  const [myItemCount, setMyItemCount] = useState(0);
  
  // UNREAD MESSAGES STATE
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function checkStudent() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, verification_status")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      if (profile.verification_status === "pending") {
        router.replace("/pending");
        return;
      }

      if (profile.verification_status !== "verified") {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setStudentName(profile.full_name || "Student");

      // Fetch stats
      const { count: listings } = await supabase.from("listings").select("*", { count: 'exact', head: true }).eq("status", "active");
      const { count: gigs } = await supabase.from("gigs").select("*", { count: 'exact', head: true }).eq("status", "active");
      const { count: myListings } = await supabase.from("listings").select("*", { count: 'exact', head: true }).eq("seller_id", user.id);
      const { count: myGigs } = await supabase.from("gigs").select("*", { count: 'exact', head: true }).eq("student_id", user.id);

      setListingCount(listings || 0);
      setGigCount(gigs || 0);
      setMyItemCount((myListings || 0) + (myGigs || 0));

      setChecking(false);
    }

    // Separate function just for the badge count so we can call it on focus
    async function checkUnreadMessages() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);
        
      setUnreadCount(unread || 0);
    }

    checkStudent();
    checkUnreadMessages();

    // Add an event listener to re-check unread messages when the tab regains focus
    window.addEventListener("focus", checkUnreadMessages);

    return () => {
      window.removeEventListener("focus", checkUnreadMessages);
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.replace("/"); 
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#EAF6FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2376B9]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EAF6FF]">
      
      {/* HEADER */}
      <header className="bg-white px-4 md:px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-10 transition-all duration-300">
        <Link href="/marketplace" className="text-xl md:text-2xl font-bold text-[#2376B9] tracking-tight hover:scale-105 transition-transform">
          UniGig.
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/about" className="text-[#173B5E] hover:text-[#2376B9] font-semibold transition-colors px-2 text-sm md:text-base">
            About Us
          </Link>
          
          {/* INBOX BUTTON WITH BADGE */}
          <Link href="/inbox" className="relative rounded-lg bg-gray-100 text-[#173B5E] px-3 md:px-5 py-2 text-sm md:text-base font-semibold hover:bg-gray-200 hover:-translate-y-0.5 transition-all">
            Inbox
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link href="/profile" className="rounded-lg bg-[#EAF6FF] text-[#2376B9] border border-[#B9E0FF] px-3 md:px-5 py-2 text-sm md:text-base font-semibold hover:bg-[#B9E0FF] hover:-translate-y-0.5 transition-all">
            Profile
          </Link>
          
          <button onClick={handleLogout} className="rounded-lg bg-[#173B5E] px-3 md:px-5 py-2 text-sm md:text-base text-white font-semibold hover:bg-[#2376B9] hover:-translate-y-0.5 transition-all shadow-sm">
            Log Out
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-16">
        
        {/* Welcome Hero (Animated) */}
        <div className="animate-fade-up bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-gray-100 relative overflow-hidden transition-all duration-500 hover:shadow-md">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#EAF6FF] opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#173B5E] mb-3">
              Welcome back, {studentName.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Your student account is verified. Ready to find a deal or offer your skills today?
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="animate-fade-up delay-100 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-gray-500 text-sm font-semibold mb-1">Active Products</p>
            <p className="text-3xl font-extrabold text-[#2376B9]">{listingCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-gray-500 text-sm font-semibold mb-1">Active Gigs</p>
            <p className="text-3xl font-extrabold text-[#55A9E8]">{gigCount}</p>
          </div>

          <Link href="/my-listings" className="block bg-[#173B5E] p-5 rounded-2xl shadow-sm text-center hover:bg-[#2376B9] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-gray-300 text-sm font-semibold mb-1 group-hover:text-white transition-colors">Your Listings</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-extrabold text-white">{myItemCount}</p>
              <span className="text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
            </div>
          </Link>

        </div>

        {/* Action Cards Grid */}
        <h3 className="animate-fade-up delay-200 text-xl font-bold text-[#173B5E] mb-4">What do you want to do?</h3>
        <div className="animate-fade-up delay-300 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link href="/unimarket" className="group block h-full">
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#2376B9] h-full flex flex-col relative overflow-hidden">
              <div className="w-14 h-14 bg-[#EAF6FF] rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🛍️
              </div>
              <h3 className="text-2xl font-bold text-[#173B5E] mb-3 group-hover:text-[#2376B9] transition-colors">
                UniMarket
              </h3>
              <p className="text-gray-600 mb-8 flex-1">
                Buy and sell textbooks, gadgets, school supplies, and dorm essentials within your campus community.
              </p>
              <span className="font-bold text-[#2376B9] flex items-center gap-2">
                Browse Products <span className="group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </div>
          </Link>

          <Link href="/gigs" className="group block h-full">
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#55A9E8] h-full flex flex-col relative overflow-hidden">
              <div className="w-14 h-14 bg-[#EAF6FF] rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 className="text-2xl font-bold text-[#173B5E] mb-3 group-hover:text-[#55A9E8] transition-colors">
                Student Gigs
              </h3>
              <p className="text-gray-600 mb-8 flex-1">
                Find tutoring, design, editing, or photography gigs. Or offer your own skills to earn extra cash.
              </p>
              <span className="font-bold text-[#55A9E8] flex items-center gap-2">
                Discover Gigs <span className="group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </div>
          </Link>

        </div>
      </section>
    </main>
  );
}