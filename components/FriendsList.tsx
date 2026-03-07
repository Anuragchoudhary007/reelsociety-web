"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function FriendsList() {

  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {

    async function load() {

      if (!user) return;

      const snap = await getDocs(
        collection(db, "users", user.uid, "friends")
      );

      setFriends(snap.docs.map((d) => d.data()));
    }

    load();

  }, [user]);

  if (!friends.length) return null;

  return (

    <div className="mt-10">

      <h2 className="text-xl mb-4">🤝 Friends</h2>

      <div className="flex flex-wrap gap-4">

        {friends.map((friend) => {

          const avatar =
            friend.photoURL ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.username}`;

          return (

            <Link key={friend.uid} href={`/user/${friend.uid}`}>

              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg hover:border-zinc-600">

                <img
                  src={avatar}
                  className="w-8 h-8 rounded-full bg-zinc-700"
                />

                <p className="text-sm">{friend.username}</p>

              </div>

            </Link>

          );
        })}

      </div>

    </div>
  );
}