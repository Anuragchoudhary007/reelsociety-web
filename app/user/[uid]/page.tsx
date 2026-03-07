"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import Link from "next/link";

export default function UserProfilePage() {

  const { uid } = useParams();

  const [profile, setProfile] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {

    async function load() {

      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid as string));

      if (snap.exists()) {
        setProfile(snap.data());
      }

      const listSnap = await getDocs(
        collection(db, "users", uid as string, "lists")
      );

      setLists(listSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })));


      const friendSnap = await getDocs(
        collection(db, "users", uid as string, "friends")
      );

      setFriends(friendSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })));

    }

    load();

  }, [uid]);



  if (!profile) return <div className="p-8">Loading...</div>;



  return (

    <div className="max-w-6xl mx-auto text-white px-4">


      {/* PROFILE HEADER */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center gap-8 mt-10">

        <img
          src={profile.photoURL || "/avatar.png"}
          className="w-24 h-24 rounded-full"
        />

        <div className="flex-1">

          <h1 className="text-3xl font-bold">
            {profile.username}
          </h1>

          <p className="text-zinc-400 mt-1">
            {profile.bio || "No bio yet."}
          </p>

        </div>

        <div className="flex gap-10 text-center">

          <div>
            <p className="text-2xl font-bold">
              {profile.watchedCount || 0}
            </p>
            <p className="text-zinc-400 text-sm">
              Watched
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {lists.length}
            </p>
            <p className="text-zinc-400 text-sm">
              Lists
            </p>
          </div>

        </div>

      </div>



      {/* FRIENDS SECTION */}

      <div className="mt-16">

        <h2 className="text-xl font-semibold mb-6">
          Friends
        </h2>

        {friends.length === 0 && (
          <p className="text-zinc-500">
            No friends yet.
          </p>
        )}

        <div className="grid grid-cols-4 gap-6">

          {friends.map((f) => (
            <FriendCard key={f.id} friendId={f.friendId} />
          ))}

        </div>

      </div>



      {/* PUBLIC LISTS */}

      <div className="mt-16 mb-20">

        <h2 className="text-xl font-semibold mb-6">
          Public Lists
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {lists.map((list) => (

            <Link
              key={list.id}
href={`/lists/${uid}/${list.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition"
            >

              <h3 className="text-lg font-semibold">
                {list.title}
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                {list.description || "Movie list"}
              </p>

              <p className="text-zinc-500 text-sm mt-4">
                {list.items?.length || 0} items
              </p>

            </Link>

          ))}

        </div>

      </div>


    </div>

  );

}



function FriendCard({ friendId }: any) {

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {

    async function load() {

      const snap = await getDoc(doc(db, "users", friendId));

      if (snap.exists()) {
        setProfile(snap.data());
      }

    }

    load();

  }, [friendId]);


  if (!profile) return null;


  return (

    <Link
      href={`/user/${friendId}`}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3 hover:border-zinc-600 transition"
    >

      <img
        src={profile.photoURL || "/avatar.png"}
        className="w-10 h-10 rounded-full"
      />

      <span className="text-blue-400 hover:underline">
        {profile.username}
      </span>

    </Link>

  );

}