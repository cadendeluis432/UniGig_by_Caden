"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InboxPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUserId(user.id);

    // 1. Fetch messages
    const { data: messagesData, error } = await supabase
      .from("messages")
      .select("*")
      .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error || !messagesData) {
      console.error("Error fetching messages:", error);
      setLoading(false);
      return;
    }

    if (messagesData.length > 0) {
      // 2. Get unique user IDs
      const userIds = Array.from(new Set(messagesData.flatMap(msg => [msg.sender_id, msg.receiver_id])));
      
      // 3. Use our new SQL function to get names/emails safely
      const { data: userDetails, error: rpcError } = await supabase.rpc('get_user_details', {
        user_ids: userIds
      });

      if (rpcError) {
        console.error("RPC Error:", rpcError);
      }

      // 4. Map the names
      const profileMap: Record<string, string> = {};
      userDetails?.forEach((p: any) => {
        profileMap[p.id] = p.display_name;
      });

      // 5. Attach names to messages
      const messagesWithNames = messagesData.map(msg => ({
        ...msg,
        senderName: profileMap[msg.sender_id] || "Unknown",
        receiverName: profileMap[msg.receiver_id] || "Unknown"
      }));

      setMessages(messagesWithNames);
    } else {
      setMessages([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [router]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUserId || !replyingTo) return;
    
    setIsSending(true);
    
    const receiverId = replyingTo.sender_id === currentUserId ? replyingTo.receiver_id : replyingTo.sender_id;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUserId,
        receiver_id: receiverId,
        listing_id: replyingTo.listing_id,
        content: replyText,
      }
    ]);

    if (error) {
      alert("Error sending reply: " + error.message);
    } else {
      setReplyText("");
      setReplyingTo(null);
      fetchMessages();
    }
    setIsSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center font-bold">Loading inbox...</div>;

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Inbox</h1>
          <Link href="/marketplace" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">You have no messages yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              
              const senderName = isMe ? "You" : msg.senderName;
              const receiverName = isMe ? msg.receiverName : "You";

              return (
                <div key={msg.id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${isMe ? 'border-gray-300' : 'border-[#2376B9]'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-[#2376B9]">
                      {isMe ? `To: ${receiverName}` : `From: ${senderName}`}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{msg.content}</p>
                  
                  {!isMe && (
                    <button 
                      onClick={() => setReplyingTo(replyingTo?.id === msg.id ? null : msg)}
                      className="text-sm font-semibold text-[#2376B9] hover:underline"
                    >
                      {replyingTo?.id === msg.id ? "Cancel Reply" : "Reply"}
                    </button>
                  )}

                  {replyingTo?.id === msg.id && (
                    <form onSubmit={handleReply} className="mt-4 flex flex-col gap-2 bg-[#EAF6FF] p-3 rounded-lg">
                      <textarea
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2376B9]"
                        rows={2}
                        placeholder={`Reply to ${msg.senderName}...`}
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          type="submit" 
                          disabled={isSending}
                          className="bg-[#2376B9] text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-[#173B5E] disabled:opacity-50"
                        >
                          {isSending ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}