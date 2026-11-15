"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-4xl mx-auto">
        
        <div className="animate-fade-up flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">About the Developers</h1>
            <p className="text-[#2376B9] font-medium mt-1">Meet the team behind UniGig</p>
          </div>
          <Link href="/marketplace" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to App
          </Link>
        </div>

        <div className="animate-fade-up delay-100 bg-white p-6 md:p-8 rounded-xl shadow-sm mb-12 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-4">The UniGig Project</h2>
          <p className="text-gray-700 leading-relaxed">
            UniGig is a student-only marketplace and services platform designed to help students buy and sell products, 
            and find or offer small jobs within their school community. Built with Next.js, Tailwind CSS, and Supabase, 
            it features secure student email verification, dynamic search, a simulated shopping cart, and an integrated messaging system.
          </p>
        </div>

        <div className="animate-fade-up delay-200 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center border-t-8 border-[#2376B9] max-w-lg w-full transform hover:-translate-y-2 transition-transform duration-300">
            
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden border-4 border-[#EAF6FF] shadow-inner flex items-center justify-center relative">
              <img 
                src="/dev1.jpg" 
                alt="Caden Charlton Eztalosa De luis" 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-gray-400 font-bold text-xl">Photo</span>';
                }}
              />
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-[#173B5E]">
              Caden Charlton Eztalosa De luis
            </h3>
            <p className="text-[#2376B9] font-bold text-lg mb-4">
              Lead Developer
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Responsible for the frontend UI, Supabase integration, and database architecture.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="bg-[#173B5E] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2376B9] transition-colors shadow-md hover:-translate-y-1">
                GitHub Profile
              </a>
              <Link href="/about/resume" className="bg-white border-2 border-[#173B5E] text-[#173B5E] px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-md hover:-translate-y-1">
                View Resume
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}