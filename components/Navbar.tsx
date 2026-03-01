"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5">
      
      <Link href="/" className="flex items-center gap-3">
        <span className="text-xl font-semibold bg-gradient-to-r from-[#FF9B7A] via-[#E8714A] to-[#B11226] bg-clip-text text-transparent">
          ReelSociety
        </span>
      </Link>

      <div className="flex items-center gap-8 text-sm uppercase tracking-widest text-gray-300">
        <Link href="/explore" className="hover:text-white transition">
          Discover
        </Link>

        <Link href="/community" className="hover:text-white transition">
          Social
        </Link>

        <Link href="/my-lists" className="hover:text-white transition">
          My Lists
        </Link>
      </div>

    </nav>
  )
}