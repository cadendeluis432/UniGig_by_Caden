"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function GigDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // MESSAGING STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => {
    const fetchGig = async () => {
      if (!id) return;
      try {
        const { data: gigData, error: gigError } = await supabase
          .from("gigs")
          .select("*")
          .eq("id", id)
          .single();

        if (gigError) throw gigError;

        if (gigData) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", gigData.student_id)
            .single();
          gigData.profiles = profileData;
        }
        setGig(gigData);
      } catch (error: any) {
        console.error("Error fetching gig:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendStatus("");

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setSendStatus("You must be logged in to send a message.");
      setSending(false);
      return;
    }

    if (user.id === gig.student_id) {
      setSendStatus("You cannot message yourself!");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: user.id,
        receiver_id: gig.student_id,
        content: messageText,
      }
    ]);

    if (error) {
      setSendStatus(`Error: ${error.message}`);
    } else {
      setSendStatus("Message sent successfully!");
      setMessageText("");
      setTimeout(() => setIsModalOpen(false), 2000);
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E] font-bold">Loading...</div>;
  if (!gig) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E]">Gig not found</div>;

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E] relative">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/gigs" className="text-[#2376B9] hover:underline font-semibold mb-6 inline-block">
          &larr; Back to Gigs
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{gig.title}</h1>
            <span className="bg-blue-100 text-[#2376B9] text-sm font-bold px-3 py-1 rounded shrink-0">
              {gig.category}
            </span>
          </div>

          <p className="text-3xl font-bold text-[#2376B9] mb-8">
            ₱{gig.price}
          </p>

          <div className="mb-8 border-t border-b py-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
          </div>

          <div className="bg-[#EAF6FF] p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Posted by</h3>
            <p className="font-bold text-xl mb-4">{gig.profiles?.full_name || "Student"}</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-[#2376B9] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#173B5E] transition-colors"
            >
              Message Student
            </button>
          </div>

        </div>
      </div>

      {/* MESSAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Message Student</h2>
            {sendStatus && <div className="mb-3 text-sm font-semibold text-[#2376B9]">{sendStatus}</div>}
            
            <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
              <textarea
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2376B9] outline-none"
                rows={4}
                placeholder={`Hi ${gig.profiles?.full_name || "there"}, I'm interested in your gig!`}
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={sending} className="bg-[#2376B9] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#173B5E] disabled:opacity-50">
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GigDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E]">Loading...</div>}>
      <GigDetailsContent />
    </Suspense>
  );
}