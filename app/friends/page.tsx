"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendRequests,
  getFriends,
  searchUsers,
} from "@/services/friendService";

import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FriendsPage() {

  const { user } = useAuth();
  const uid = user?.uid;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  /* ================= LOAD FRIENDS ================= */

  useEffect(() => {

    if (!uid) return;

    async function load() {

      const req = await getFriendRequests(uid);
      const fr = await getFriends(uid);

      setRequests(req);
      setFriends(fr);

    }

    load();

  }, [uid]);


  /* ================= SEARCH USERS ================= */

  async function handleSearch() {

    if (!search) return;

    const users = await searchUsers(search);

    setResults(users);

  }


  return (

    <div className="max-w-5xl mx-auto text-white px-4 py-8">

      <h1 className="text-3xl font-bold mb-10">Friends</h1>

      {/* ================= ADD FRIENDS ================= */}

      <div className="mb-12 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">Add Friends</h2>

        <div className="flex gap-3 mb-6">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg w-80 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>

        </div>

        {results.map((u) => {

          const avatar =
            u.photoURL ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`;

          return (

            <div
              key={u.id}
              className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg mb-3 hover:bg-zinc-700"
            >

              <div className="flex items-center gap-3">

                <img
                  src={avatar}
                  className="w-10 h-10 rounded-full bg-zinc-700"
                />

                <span className="font-medium">{u.username}</span>

              </div>

              <button
                onClick={() => {
                  if (!uid) return;
                  sendFriendRequest(uid, u.id);
                }}
                className="bg-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
              >
                Add
              </button>

            </div>

          );

        })}

      </div>


      {/* ================= FRIEND REQUESTS ================= */}

      <div className="mb-12">

        <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>

        {requests.length === 0 && (
          <p className="text-zinc-500 italic">No pending requests</p>
        )}

        {requests.map((r) => (
          <FriendRequestCard key={r.id} request={r} />
        ))}

      </div>


      {/* ================= FRIEND LIST ================= */}

      <div>

        <h2 className="text-lg font-semibold mb-4">My Friends</h2>

        {friends.length === 0 && (
          <p className="text-zinc-500 italic">You don't have friends yet.</p>
        )}

        {friends.map((f) => (
          <FriendCard key={f.friendId} friend={f} uid={uid} />
        ))}

      </div>

    </div>

  );

}


/* =========================================================
   FRIEND REQUEST CARD
========================================================= */

function FriendRequestCard({ request }: any) {

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {

    async function load() {

      const snap = await getDoc(doc(db, "users", request.from));

      if (snap.exists()) setProfile(snap.data());

    }

    load();

  }, [request.from]);

  const avatar =
    profile?.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.username}`;

  return (

    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl mb-3">

      <div className="flex items-center gap-3">

        <img src={avatar} className="w-10 h-10 rounded-full bg-zinc-700" />

        <span>{profile?.username}</span>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            acceptFriendRequest(request.id, request.from, request.to)
          }
          className="bg-green-600 px-4 py-1.5 rounded-lg hover:bg-green-700 text-sm"
        >
          Accept
        </button>

        <button
          onClick={() => rejectFriendRequest(request.id)}
          className="bg-zinc-700 px-4 py-1.5 rounded-lg hover:bg-red-600 text-sm"
        >
          Reject
        </button>

      </div>

    </div>

  );

}


/* =========================================================
   FRIEND CARD
========================================================= */

function FriendCard({ friend, uid }: any) {

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {

    async function load() {

      const snap = await getDoc(doc(db, "users", friend.friendId));

      if (snap.exists()) setProfile(snap.data());

    }

    load();

  }, [friend.friendId]);

  const avatar =
    profile?.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.username}`;

  return (

    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl hover:border-zinc-700 mb-3">

      <Link href={`/user/${friend.friendId}`}>

        <div className="flex items-center gap-3 cursor-pointer">

          <img src={avatar} className="w-10 h-10 rounded-full bg-zinc-700" />

          <span className="font-medium hover:text-blue-400">
            {profile?.username}
          </span>

        </div>

      </Link>

      <button
        onClick={() => {
          if (!uid) return;
          removeFriend(uid, friend.friendId);
        }}
        className="text-zinc-500 hover:text-red-500"
      >
        Remove
      </button>

    </div>

  );

}