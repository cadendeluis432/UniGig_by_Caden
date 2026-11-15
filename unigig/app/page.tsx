"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#173B5E] font-sans selection:bg-[#2376B9] selection:text-white">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#2376B9] hover:scale-105 transition-transform">
            UniGig.
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="/unimarket" className="hover:text-[#2376B9] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2376B9] hover:after:w-full after:transition-all after:duration-300">Marketplace</Link>
            <Link href="/gigs" className="hover:text-[#2376B9] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2376B9] hover:after:w-full after:transition-all after:duration-300">Student Gigs</Link>
            <Link href="/about" className="hover:text-[#2376B9] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2376B9] hover:after:w-full after:transition-all after:duration-300">About</Link>
          </div>

          <Link 
            href="/signup" 
            className="bg-[#2376B9] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-[#173B5E] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-start justify-center">
        
        {/* Animated Tag */}
        <div className="animate-fade-up bg-[#B9E0FF] text-[#173B5E] px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-sm">
          Your campus. Your opportunities.
        </div>

        {/* Animated Headline */}
        <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
          <span className="text-[#173B5E]">Discover More.</span><br />
          <span className="text-[#2376B9]">Earn More.</span><br />
          <span className="text-[#173B5E]">Connect Better.</span>
        </h1>

        {/* Animated Subheadline */}
        <p className="animate-fade-up delay-200 text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The online marketplace built for students. Buy and sell campus essentials, discover student services, and turn your skills into opportunities.
        </p>

        {/* Animated Buttons */}
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/unimarket" 
            className="bg-[#2376B9] text-white text-center px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#173B5E] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl"
          >
            Explore Marketplace
          </Link>
          <Link 
            href="/gigs" 
            className="bg-white border-2 border-gray-200 text-[#173B5E] text-center px-8 py-4 rounded-xl font-bold text-lg hover:border-[#2376B9] hover:text-[#2376B9] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Find Student Gigs
          </Link>
        </div>
      </section>

      {/* 3. FEATURE CARDS SECTION */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-[#EAF6FF] p-10 rounded-3xl flex flex-col items-start hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-[#B9E0FF] group">
              <h2 className="text-3xl font-bold mb-4 group-hover:text-[#2376B9] transition-colors">UniMarket</h2>
              <p className="text-gray-600 mb-8 text-lg flex-1">
                Buy and sell textbooks, gadgets, school supplies, clothes, and dorm essentials with fellow students.
              </p>
              <Link 
                href="/unimarket" 
                className="bg-[#2376B9] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#173B5E] transition-colors shadow-md flex items-center gap-2"
              >
                Explore Marketplace <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="bg-[#B9E0FF] p-10 rounded-3xl flex flex-col items-start hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-[#55A9E8] group">
              <h2 className="text-3xl font-bold mb-4 group-hover:text-[#173B5E] transition-colors">Student Gigs</h2>
              <p className="text-[#173B5E] mb-8 text-lg flex-1 opacity-90">
                Find tutoring, graphic design, editing, photography, and other opportunities to earn using your skills.
              </p>
              <Link 
                href="/gigs" 
                className="bg-[#173B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2376B9] transition-colors shadow-md flex items-center gap-2"
              >
                Discover Gigs <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BOTTOM BANNER */}
      <section className="bg-[#2376B9] py-20 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Your next opportunity starts here.
        </h2>
        <Link 
          href="/signup" 
          className="inline-block bg-white text-[#2376B9] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
        >
          Create Your Account
        </Link>
      </section>

    </div>
  );
}