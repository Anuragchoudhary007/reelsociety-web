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

      // fetch public lists
      const listsRef = collection(db, "users", uid, "lists");
      const listsSnap = await getDocs(listsRef);

      const publicLists = listsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((l: any) => l.isPublic !== false);

      setLists(publicLists);

      // watchlist stats
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

        {lists.map((list:any)=>(
          <Link
            key={list.id}
            href={`/list/${uid}/${list.id}`}
          >
            <div className="bg-white/5 border border-white/10 p-4 mb-4 rounded-lg hover:bg-white/10 transition">

              <h3 className="text-lg font-semibold">
                {list.name}
              </h3>

              <p className="text-gray-400 text-sm">
                {list.description || "No description"}
              </p>

            </div>
          </Link>
        ))}

      </div>

    </div>
  );
}