"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
  try {
    const res = await fetch(
      `/api/tmdb/search/multi?query=${encodeURIComponent(query)}`
    );

    if (!res.ok) {
      setResults([]);
      return;
    }

    const data = await res.json();
    setResults(data?.results?.slice(0, 6) || []);
  } catch (error) {
    console.error("Search error:", error);
    setResults([]);
  }
};
    const delay = setTimeout(fetchSearch, 400);
    return () => clearTimeout(delay);

  }, [query]);

  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-black border-b border-white/10">
<Link href="/watchlist">
  <button className="px-4 py-2 border border-white/30 rounded">
    Watchlist
  </button>
</Link>
      <Link href="/">
        <h1 className="text-xl font-semibold text-red-500">
          ReelSociety
        </h1>
      </Link>

      {/* SEARCH */}
      <div className="relative w-96">

        <input
          type="text"
          placeholder="Search movies, actors..."
          className="w-full p-2 bg-black border border-white/20 rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length > 0 && (
  <div className="absolute top-12 w-full bg-black border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">

    {results.map((item) => (
      <Link
        key={item.id}
        href={
          item.media_type === "person"
            ? `/person/${item.id}`
            : `/movie/${item.id}`
        }
      >
        <div className="flex items-center gap-3 p-3 hover:bg-white/5 transition">

          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
              className="w-10 h-14 object-cover rounded-md"
            />
          ) : (
            <div className="w-10 h-14 bg-gray-800 rounded-md" />
          )}

          <div>
            <p className="text-white text-sm">
              {item.title || item.name}
            </p>
            <p className="text-gray-400 text-xs">
              {item.release_date?.slice(0,4)}
            </p>
          </div>

        </div>
      </Link>
    ))}
  </div>
)}
      </div>

      {/* AUTH BUTTON */}
      <div>
        {user ? (
          <button
            onClick={() => signOut(auth)}
            className="border border-white/30 px-4 py-2 rounded-md hover:bg-white/10"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="border border-white/30 px-4 py-2 rounded-md hover:bg-white/10">
              Login
            </button>
          </Link>
        )}
      </div>
<Link href="/feed">
  <button className="px-4 py-2 border border-white/30 rounded hover:bg-white/10">
    News
  </button>
</Link>
    </nav>
  );
}