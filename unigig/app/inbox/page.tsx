"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Call the SQL function we just created
      const { data, error } = await supabase.rpc('get_my_conversations', {
        user_id: user.id
      });

      if (error) {
        console.error("Error fetching conversations:", error);
      } else {
        setConversations(data || []);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center font-bold">Loading inbox...</div>;

  return (
    <div className="animate-fade-in min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-3xl mx-auto">
        <div className="animate-fade-up flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
          <Link href="/marketplace" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 text-lg mb-4">No messages yet.</p>
            <p className="text-gray-400 text-sm">When you message a seller or someone messages you, it will appear here.</p>
          </div>
        ) : (
          <div className="animate-fade-up delay-100 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {conversations.map((conv) => (
              <Link 
                href={`/inbox/${conv.other_user_id}`} 
                key={conv.other_user_id}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar circle */}
                <div className="w-12 h-12 bg-[#2376B9] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {conv.other_user_name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#173B5E] truncate">{conv.other_user_name}</h3>
                  <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                </div>
                
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(conv.last_message_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}