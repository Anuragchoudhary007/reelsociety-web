"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {

  const { user } = useAuth();

  return (

    <nav className="flex items-center justify-between px-10 py-4 border-b border-white/10">

      <Link href="/">
        <h1 className="text-xl font-semibold text-white">
          ReelSociety
        </h1>
      </Link>

      <input
        placeholder="Search movies..."
        className="w-[420px] px-4 py-2 bg-black border border-white/20 rounded-lg"
      />

      <div className="flex items-center gap-4">

        <Link href="/profile">
          <button className="px-4 py-2 border border-white/30 rounded-lg">
            Profile
          </button>
        </Link>

        {user && (
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 border border-white/30 rounded-lg"
          >
            Logout
          </button>
        )}

      </div>

    </nav>

  );
}