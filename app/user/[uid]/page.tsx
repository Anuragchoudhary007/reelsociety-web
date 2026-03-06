"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";
import Link from "next/link";

const IMAGE = "https://image.tmdb.org/t/p/w500";

export default function UserProfilePage() {

  const params = useParams();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {

    async function loadProfile() {

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }

      /* FETCH LISTS */

      const listsRef = collection(db, "users", uid, "lists");
      const listsSnap = await getDocs(listsRef);

      const publicLists = await Promise.all(
        listsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((l: any) => l.isPublic !== false)
          .map(async (list: any) => {

            const itemsSnap = await getDocs(
              collection(db, "users", uid, "lists", list.id, "items")
            );

            const preview = itemsSnap.docs
              .slice(0, 1)
              .map(d => d.data());

            return {
              ...list,
              preview,
              count: itemsSnap.size
            };

          })
      );

      setLists(publicLists);

      /* WATCHLIST COUNT */

      const watchRef = collection(db, "users", uid, "watchlist");
      const watchSnap = await getDocs(watchRef);

      setWatchlistCount(watchSnap.size);

    }

    loadProfile();

  }, [uid]);

  if (!profile) {
    return <div className="p-10 text-white">Loading profile...</div>;
  }

  return (

    <div className="p-10 text-white max-w-4xl">

      {/* PROFILE HEADER */}

      <div className="flex items-center gap-6 mb-8">

        <img
          src={profile.photoURL || "/avatar.png"}
          className="w-24 h-24 rounded-full"
        />

        <div>

          <h1 className="text-3xl font-bold">
            {profile.username}
          </h1>

          <p className="text-gray-400 mt-1">
            {profile.bio || "No bio yet"}
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="flex gap-8 mb-10">

        <div>
          <p className="text-lg font-semibold">
            {watchlistCount}
          </p>
          <p className="text-gray-400 text-sm">
            Watchlist
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold">
            {lists.length}
          </p>
          <p className="text-gray-400 text-sm">
            Public Lists
          </p>
        </div>

      </div>

      {/* PUBLIC LISTS */}

      <div>

        <h2 className="text-2xl mb-6">
          Public Lists
        </h2>

        {lists.length === 0 && (
          <p className="text-gray-500">
            No public lists yet
          </p>
        )}

        {lists.map((list: any) => {

          const poster = list.preview?.[0]?.poster_path;

          return (

            <Link
              key={list.id}
             href={`/lists/${list.id}`}
            >

              <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4 hover:bg-white/10 transition">

                <div className="w-28 h-40 bg-gray-900">

                  {poster && (
                    <img
                      src={`${IMAGE}${poster}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                </div>

                <div className="p-4 flex flex-col justify-center">

                  <h3 className="text-lg font-semibold">
                    {list.name}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {list.count} movies
                  </p>

                </div>

              </div>

            </Link>

          );

        })}

      </div>

    </div>

  );

}