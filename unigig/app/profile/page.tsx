"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, student_id_number, verification_status")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setStudentId(data.student_id_number || "");
        setStatus(data.verification_status);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        student_id_number: studentId,
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E] font-semibold">Loading profile...</div>;
  }

  return (
    <div className="animate-fade-in min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-xl mx-auto">
        
        <div className="animate-fade-up flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Link href="/marketplace" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="animate-fade-up delay-100 bg-white p-5 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          
          {message.text && (
            <div className={`mb-4 p-3 rounded text-sm font-medium ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            
            <div>
              <label className="block mb-1 font-semibold text-gray-500 text-sm">School Email (Cannot be changed)</label>
              <input type="text" value={email} disabled className="w-full border p-2.5 rounded bg-gray-100 text-gray-500 cursor-not-allowed text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-500 text-sm">Account Status</label>
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {status?.toUpperCase() || "PENDING"}
              </span>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border p-2.5 rounded transition-colors focus:border-[#2376B9] outline-none"
                placeholder="e.g., Juan Dela Cruz"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Student ID Number</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full border p-2.5 rounded transition-colors focus:border-[#2376B9] outline-none"
                placeholder="e.g., 2024-00123"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#2376B9] text-white px-6 py-2.5 rounded font-semibold hover:bg-[#173B5E] disabled:opacity-50 mt-2 transition-all w-full md:w-auto hover:-translate-y-0.5 shadow-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}