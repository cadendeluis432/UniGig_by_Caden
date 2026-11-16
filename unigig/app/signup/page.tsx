"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters.");
      return;
    }
    
    // NOTE: Change this to "@mcc.edu.ph" if you want to restrict it to MCC students!
    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      setMessage("Please use your email address.");
      return;
    }

    setLoading(true);

      const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id_number: studentId,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Registration successful! Please check your school email to confirm your account. Your student verification status is pending."
    );

    setFullName("");
    setStudentId("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#EAF6FF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-[#2376B9]"
          >
            UniGig
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-[#173B5E]">
            Join UniGig!
          </h1>

          <p className="mt-2 text-gray-500">
            Create your student account and discover campus opportunities.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-[#173B5E] placeholder:text-gray-400 outline-none focus:border-[#55A9E8]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Student ID Number
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-[#173B5E] placeholder:text-gray-400 outline-none focus:border-[#55A9E8]"
            />
          </div>

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
              placeholder="Create a password (8+ characters)"
              minLength={8}
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
            {loading ? "Creating Account..." : "Create Student Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2376B9] hover:underline"
          >
            Log in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your account will remain pending until your student status is verified.
        </p>
      </div>
    </main>
  );
}