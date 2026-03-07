"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [watched, setWatched] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUser(u);

      const watchedSnap = await getDocs(
        collection(db, "users", u.uid, "watched")
      );

      const watchlistSnap = await getDocs(
        collection(db, "users", u.uid, "watchlist")
      );

      const listsSnap = await getDocs(
        collection(db, "users", u.uid, "lists")
      );

      setWatched(watchedSnap.docs.map((d) => d.data()));
      setWatchlist(watchlistSnap.docs.map((d) => d.data()));
      setLists(listsSnap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, []);

  if (!user) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="text-white">

      {/* HERO BANNER */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src="https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      {/* PROFILE CARD */}
      <div className="max-w-5xl mx-auto -mt-24 relative z-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center gap-8">

          <img
            src={user.photoURL || "/avatar.png"}
            className="w-24 h-24 rounded-full object-cover border border-zinc-700"
          />

          <div className="flex-1">
            <h2 className="text-3xl font-bold">{user.displayName || "User"}</h2>

            <p className="text-zinc-400">{user.email}</p>

            <p className="text-zinc-500 mt-2">
              Movie lover 🍿
            </p>

            <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
              Edit Profile
            </button>
          </div>

          <div className="flex gap-10 text-center">

            <div>
              <p className="text-2xl font-bold">{watched.length}</p>
              <p className="text-zinc-400 text-sm">Watched</p>
            </div>

            <div>
              <p className="text-2xl font-bold">{watchlist.length}</p>
              <p className="text-zinc-400 text-sm">Watchlist</p>
            </div>

            <div>
              <p className="text-2xl font-bold">{lists.length}</p>
              <p className="text-zinc-400 text-sm">Lists</p>
            </div>

          </div>
        </div>
      </div>

      {/* RECENTLY WATCHED */}
      <section className="max-w-6xl mx-auto mt-16 px-4">

        <h2 className="text-2xl font-semibold mb-6">
          Recently Watched
        </h2>

        <div className="grid grid-cols-6 gap-4">

          {watched.slice(0, 6).map((movie, i) => (
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="rounded-lg hover:scale-105 transition"
            />
          ))}

        </div>
      </section>

      {/* MY LISTS */}
      <section className="max-w-6xl mx-auto mt-16 px-4">

        <h2 className="text-2xl font-semibold mb-6">
          My Lists
        </h2>

        <div className="grid grid-cols-3 gap-6">

          {lists.map((list: any, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition"
            >
              <h3 className="text-lg font-semibold">
                {list.title}
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                {list.description || "Movie list"}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* WATCHLIST */}
      <section className="max-w-6xl mx-auto mt-16 px-4 mb-20">

        <h2 className="text-2xl font-semibold mb-6">
          Watchlist
        </h2>

        <div className="grid grid-cols-6 gap-4">

          {watchlist.slice(0, 6).map((movie, i) => (
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="rounded-lg hover:scale-105 transition"
            />
          ))}

        </div>
      </section>

    </div>
  );
}