"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }: any) {
  const { user } = useAuth();
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    if (!user) return;

    const ref = doc(
      db,
      "users",
      user.uid,
      "watched",
      movie.id.toString()
    );

    const unsub = onSnapshot(ref, (snap) => {
      setIsWatched(snap.exists());
    });

    return () => unsub();
  }, [user, movie.id]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="relative group cursor-pointer"
    >
      {/* Watched Badge */}
      {isWatched && (
        <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          ✓ Watched
        </div>
      )}

      <img
        src={`${IMAGE_BASE}${movie.poster_path}`}
        className="rounded-md shadow-md group-hover:shadow-xl transition duration-300"
        alt={movie.title}
      />

      <div className="mt-3">
        <p className="text-sm font-medium line-clamp-1">
          {movie.title}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          ⭐ {movie.vote_average?.toFixed(1)} / 10
        </p>
      </div>
    </motion.div>
  );
}