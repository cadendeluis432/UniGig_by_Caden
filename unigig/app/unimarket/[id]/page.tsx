"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

function ProductDetailsContent() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // MESSAGING STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select(`*, categories (name)`)
          .eq("id", id)
          .single();

        if (listingError) throw listingError;

        if (listingData) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", listingData.seller_id)
            .single();
          listingData.profiles = profileData;
        }
        setListing(listingData);
      } catch (error: any) {
        console.error("Error fetching product:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // HANDLE SENDING MESSAGE
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
    if (user.id === listing.seller_id) {
      setSendStatus("You cannot message yourself!");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: user.id,
        receiver_id: listing.seller_id,
        listing_id: listing.id,
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
  if (!listing) return <div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E]">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E] relative">
      <div className="max-w-4xl mx-auto">
        <Link href="/unimarket" className="text-[#2376B9] hover:underline font-semibold mb-6 inline-block">
          &larr; Back to UniMarket
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 min-h-[300px] md:min-h-[400px] flex items-center justify-center relative">
            {listing.image_urls ? (
              <img src={listing.image_urls} alt={listing.title} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <span className="text-gray-400 font-semibold">No Image Provided</span>
            )}
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-gray-500 font-medium mb-4">
              Category: {listing.categories?.name || "Uncategorized"} | {listing.condition}
            </p>
            <p className="text-3xl font-bold text-[#2376B9] mb-6">₱{listing.price}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-lg border-b pb-2 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            <div className="mt-auto bg-[#EAF6FF] p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Seller Information</h3>
              <p className="text-sm mb-4">Listed by: <span className="font-bold">{listing.profiles?.full_name || "Student"}</span></p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    addToCart({ id: listing.id, title: listing.title, price: listing.price, image_urls: listing.image_urls, seller_id: listing.seller_id });
                    setAdded(true);
                  }}
                  disabled={added}
                  className={`w-full px-4 py-3 rounded font-bold transition-colors ${added ? "bg-green-500 text-white" : "bg-[#2376B9] text-white hover:bg-[#173B5E]"}`}
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </button>

                {/* THIS BUTTON OPENS THE MODAL */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white border-2 border-[#2376B9] text-[#2376B9] px-4 py-2 rounded font-semibold hover:bg-gray-50 transition-colors"
                >
                  Message Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Message Seller</h2>
            {sendStatus && <div className="mb-3 text-sm font-semibold text-[#2376B9]">{sendStatus}</div>}
            
            <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
              <textarea
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2376B9] outline-none"
                rows={4}
                placeholder={`Hi ${listing.profiles?.full_name || "there"}, is this still available?`}
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

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EAF6FF] flex items-center justify-center text-[#173B5E]">Loading...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}