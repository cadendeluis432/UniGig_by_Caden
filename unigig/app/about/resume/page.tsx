"use client";

import Link from "next/link";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/about" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to About
          </Link>
          <a 
            href="mailto:deluiscadencharlton432@gmail.com" 
            className="bg-[#2376B9] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#173B5E] transition-colors"
          >
            Email Me
          </a>
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-8 border-[#2376B9]">
          
          {/* Name & Title */}
          <div className="text-center border-b pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Caden Charlton Eztalosa De luis</h1>
            <p className="text-xl text-[#2376B9] font-semibold">Lead Full-Stack Developer</p>
            <p className="text-gray-500 mt-2">
              deluiscadencharlton432@gmail.com | github.com/ | Philippines
            </p>
          </div>

          {/* Profile Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#2376B9] border-b-2 border-[#EAF6FF] pb-1 mb-3 uppercase tracking-wide">
              Profile Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              A passionate student developer currently studying at MCC. Experienced in building modern, 
              responsive web applications using Next.js, TypeScript, and Supabase. Dedicated to creating 
              seamless user experiences and secure database architectures.
            </p>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#2376B9] border-b-2 border-[#EAF6FF] pb-1 mb-3 uppercase tracking-wide">
              Education
            </h2>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Bachelor of Science in Information Technology</h3>
              <p className="text-gray-600">MCC (Mabalacat City College) | Expected Graduation: 2027</p>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#2376B9] border-b-2 border-[#EAF6FF] pb-1 mb-3 uppercase tracking-wide">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {["TypeScript", "Next.js", "React", "Tailwind CSS", "Supabase", "PostgreSQL", "HTML/CSS", "Git & GitHub", "UI/UX Design"].map((skill) => (
                <span key={skill} className="bg-[#EAF6FF] text-[#173B5E] px-3 py-1 rounded-full text-sm font-semibold border border-[#B9E0FF]">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-bold text-[#2376B9] border-b-2 border-[#EAF6FF] pb-1 mb-3 uppercase tracking-wide">
              Featured Projects
            </h2>
            <div className="mb-4">
              <h3 className="font-bold text-lg">UniGig (Student Marketplace)</h3>
              <p className="text-gray-700 mt-1">
                Developed a student-only marketplace platform featuring secure email domain verification, 
                dynamic product searching, a simulated shopping cart, and a user-to-user messaging system. 
                Engineered the frontend with Next.js and Tailwind CSS, and built the backend using Supabase with Row Level Security.
              </p>
            </div>
            {/* You can add more projects here */}
          </section>

        </div>
        
        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          &copy; 2026 Caden Charlton Eztalosa De luis. Built for Web Programming Final Project.
        </p>

      </div>
    </div>
  );
}