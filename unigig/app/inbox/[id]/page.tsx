"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function ChatRoomContent() {
  const { id: otherUserId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUserId(user.id);

    // FETCH THE OTHER USER'S NAME (Using the SQL function we created earlier)
    const { data: userDetails } = await supabase.rpc('get_user_details', {
      user_ids: [otherUserId]
    });
    
    // If we found their name/email, set it. Otherwise, default to "Student"
    if (userDetails && userDetails.length > 0) {
      setOtherUserName(userDetails[0].display_name);
    }

    // Fetch all messages between the two users
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(msgs || []);
    setLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    fetchChat();
  }, [otherUserId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    setSending(true);
    const msgText = newMessage;
    setNewMessage(""); 

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: msgText,
      }
    ]);

    if (!error) {
      await fetchChat();
    } else {
      console.error("Failed to send", error);
      setNewMessage(msgText); 
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center font-bold">Loading chat...</div>;

  return (
    <div className="min-h-screen bg-[#EAF6FF] flex flex-col h-screen">
      
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/inbox" className="text-[#2376B9] font-bold text-xl hover:-translate-x-1 transition-transform">
          &larr;
        </Link>
        <div className="w-10 h-10 bg-[#2376B9] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {otherUserName.charAt(0).toUpperCase()}
        </div>
        {/* THIS IS WHERE THE NAME SHOWS UP */}
        <h1 className="text-lg font-bold text-[#173B5E]">{otherUserName}</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Say hi to start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isMe 
                      ? 'bg-[#2376B9] text-white rounded-br-sm' 
                      : 'bg-white text-[#173B5E] border border-gray-100 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 text-[#173B5E] px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2376B9] transition-all"
          />
          <button 
            type="submit" 
            disabled={sending || !newMessage.trim()}
            className="bg-[#2376B9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#173B5E] disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  );
}

export default function ChatRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center">Loading...</div>}>
      <ChatRoomContent />
    </Suspense>
  );
}