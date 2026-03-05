"use client";

import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    ratings: 0,
    reviews: 0,
    watchlist: 0,
    avgRating: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const ratingsSnap = await getDocs(
        collection(db, "users", user.uid, "ratings")
      );

      const reviewsSnap = await getDocs(
        collection(db, "movies")
      );

      const watchlistSnap = await getDocs(
        collection(db, "users", user.uid, "watchlist")
      );

      let total = 0;
      ratingsSnap.forEach((doc) => {
        total += doc.data().rating;
      });

      setStats({
        ratings: ratingsSnap.size,
        reviews: 0,
        watchlist: watchlistSnap.size,
        avgRating:
          ratingsSnap.size > 0
            ? parseFloat((total / ratingsSnap.size).toFixed(1))
            : 0,
      });
    };

    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-24">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-8 mb-16">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl">
            {user.email?.[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-display">
              {user.email}
            </h1>
            <p className="text-gray-400">
              Member since 2026
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">

          <StatCard title="Ratings" value={stats.ratings} />
          <StatCard title="Avg Rating" value={stats.avgRating} />
          <StatCard title="Watchlist" value={stats.watchlist} />
          <StatCard title="Reviews" value={stats.reviews} />

        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center hover:scale-105 transition">
      <p className="text-4xl font-bold text-red-500">{value}</p>
      <p className="text-gray-400 mt-2">{title}</p>
    </div>
  );
}