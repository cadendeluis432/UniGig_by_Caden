"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewGigPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Get the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to post a gig.");
      setLoading(false);
      return;
    }

    // 2. Insert the gig into Supabase
    const { error } = await supabase.from("gigs").insert([
      {
        student_id: user.id,
        title: title,
        description: description,
        price: parseFloat(price), // Ensure price is a number
        category: category,
        status: "active", 
      },
    ]);

    if (error) {
      console.error(error);
      // Fixed the quotes here!
      setMessage(`Error: ${error.message}`);
      setLoading(false);
    } else {
      // Success! Redirect back to the gigs browse page
      router.push("/gigs");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-xl mx-auto bg-white p-5 md:p-6 rounded-lg shadow-md">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Post a New Gig</h1>
          <Link href="/gigs" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back
          </Link>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Gig Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g., Math Tutoring for Calculus 1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              placeholder="Describe the service you are offering..."
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Price (₱)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g., Tutoring, Design, Errands"
            />
          </div>

          {/* Buttons - Fixed width on mobile for easier tapping */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#2376B9] text-white px-6 py-2.5 rounded font-semibold hover:bg-[#173B5E] disabled:opacity-50 transition-colors"
            >
              {loading ? "Posting..." : "Post Gig"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/gigs")}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2.5 rounded font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}