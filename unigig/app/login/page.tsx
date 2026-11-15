"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("verification_status")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setMessage("We couldn't find your student profile. Please contact support.");
      await supabase.auth.signOut();
      return;
    }

    if (profile.verification_status === "pending") {
      router.push("/pending");
      return;
    }

    if (profile.verification_status === "verified") {
      router.push("/marketplace");
      return;
    }

    setMessage("Your account is not approved for marketplace access.");
    await supabase.auth.signOut();
  }

  return (
    <main className="min-h-screen bg-[#EAF6FF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#2376B9]">
            UniGig
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-[#173B5E]">
            Welcome Back!
          </h1>

          <p className="mt-2 text-gray-500">
            Log in to your student account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              School Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your school email"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-[#173B5E] placeholder:text-gray-400 outline-none focus:border-[#55A9E8]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-[#173B5E] placeholder:text-gray-400 outline-none focus:border-[#55A9E8]"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-[#EAF6FF] p-3 text-sm text-[#173B5E]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2376B9] py-3 font-semibold text-white transition hover:bg-[#173B5E] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#2376B9] hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </main>
  );
}