"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function WatchlistPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    async function fetchWatchlist() {
      const snap = await getDocs(
        collection(db, "users", user.uid, "watchlist")
      );
      setMovies(snap.docs.map((doc) => doc.data()));
    }

    fetchWatchlist();
  }, [user]);

  if (!user) return <p className="text-center mt-20">Login required.</p>;

  return (
    <main className="p-12 bg-black min-h-screen text-white">
      <h1 className="text-4xl mb-8">My Watchlist</h1>

      <div className="grid grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link key={movie.movieId} href={`/movie/${movie.movieId}`}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
              className="rounded-lg hover:scale-105 transition"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}