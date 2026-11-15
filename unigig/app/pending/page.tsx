"use client";

import { supabase } from "../../lib/supabase";

export default function PendingPage() {
  
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // <--- FORCES FULL RELOAD TO HOMEPAGE
  }

  return (
    <main className="min-h-screen bg-[#EAF6FF] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#173B5E] mb-4">
          Account Pending
        </h1>
        <p className="text-gray-600 mb-6">
          Your account is currently pending verification. Please check your school email to confirm your account, or wait for an administrator to verify your student status.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-[#2376B9] text-white py-3 rounded-lg font-semibold hover:bg-[#173B5E] transition-colors"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}