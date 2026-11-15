"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SupabaseTest() {
  const [message, setMessage] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("categories")
        .select("id")
        .limit(1);

      if (error) {
        setMessage("Connection test failed: " + error.message);
      } else {
        setMessage("Successfully connected to Supabase!");
      }
    }

    testConnection();
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>UniGig Connection Test</h1>
      <p>{message}</p>
    </main>
  );
}
