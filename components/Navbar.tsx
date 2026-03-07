"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-white/10 sticky top-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-md">
      <Link href="/">
        <h1 className="text-xl font-bold text-white tracking-tight">
          ReelSociety
        </h1>
      </Link>

      <div className="relative">
        <input
          placeholder="Search movies..."
          className="w-[420px] px-4 py-2 bg-black border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <Link href="/profile">
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition">
            Profile
          </button>
        </Link>

        {user && (
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}