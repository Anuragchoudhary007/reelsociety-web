"use client";

import { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function WatchlistButton({ movie }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function checkWatchlist() {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "watchlist", movie.id.toString());
      const snap = await getDoc(ref);
      setSaved(snap.exists());
    }

    checkWatchlist();
  }, [user, movie.id]);

  const toggleWatchlist = async () => {
    if (!user) {
      alert("Login required");
      return;
    }
await addDoc(collection(db, "activity"), {
  userId: user.uid,
  username: user.displayName,
  type: "watchlist",
  movieId: movie.id,
  movieTitle: movie.title,
  createdAt: serverTimestamp(),
});
    setLoading(true);

    const ref = doc(db, "users", user.uid, "watchlist", movie.id.toString());

    if (saved) {
      await deleteDoc(ref);
      setSaved(false);
    } else {
      await setDoc(ref, {
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        backdrop: movie.backdrop_path,
        addedAt: serverTimestamp(),
      });
      setSaved(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`px-6 py-3 rounded-md transition border ${
        saved
          ? "bg-green-600 border-green-500 hover:bg-green-500"
          : "border-white/30 hover:bg-white/10"
      }`}
    >
      {saved ? "✓ In Watchlist" : "+ Watchlist"}
    </button>
  );
}