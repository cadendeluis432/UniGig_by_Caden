"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("New");
  const [categoryId, setCategoryId] = useState("");
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      if (data) {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    };
    fetchCategories();
  }, []);

  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Creates a temporary local URL for preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to post a product.");
      setLoading(false);
      return;
    }

    try {
      let uploadedImageUrl = null;

      // 1. Upload Image to Supabase Storage (if one was selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2. Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
          
        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // 3. Insert the Product into the Database
      const { error: dbError } = await supabase.from("listings").insert([
        {
          seller_id: user.id,
          title: title,
          description: description,
          price: parseFloat(price),
          condition: condition,
          category_id: categoryId,
          status: "active",
          image_urls: uploadedImageUrl, 
        },
      ]);

      if (dbError) throw dbError;

      // Success! Redirect to UniMarket
      router.push("/unimarket");

    } catch (error: any) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-4 md:p-8 text-[#173B5E]">
      <div className="max-w-xl mx-auto bg-white p-5 md:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Sell a Product</h1>
          <Link href="/unimarket" className="text-[#2376B9] hover:underline font-semibold text-sm">
            &larr; Back
          </Link>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Image Upload Field */}
          <div>
            <label className="block mb-1 font-semibold">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded bg-gray-50 text-sm"
            />
            {imagePreview && (
              <div className="mt-3 relative w-full h-48 border rounded overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g., Scientific Calculator"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
              placeholder="Describe the item's condition, age, etc."
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
              placeholder="e.g., 500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Condition</label>
            <select
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used - Good">Used - Good</option>
              <option value="Used - Fair">Used - Fair</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2376B9] text-white px-6 py-2.5 rounded font-semibold hover:bg-[#173B5E] disabled:opacity-50 mt-4 transition-colors"
          >
            {loading ? "Posting..." : "Post Product"}
          </button>
        </form>
      </div>
    </div>
  );
}