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
  searchUsers
} from "@/services/friendService";
import Link from "next/dist/client/link";

export default function FriendsPage() {

  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {

    if (!user) return;

    async function load() {

      const req = await getFriendRequests(user.uid);
      const fr = await getFriends(user.uid);

      setRequests(req);
      setFriends(fr);
    }

    load();

  }, [user]);

  async function handleSearch() {

    if (!search) return;

    const users = await searchUsers(search);

    setResults(users);
  }

  return (
    <div className="p-10 text-white">

      <h1 className="text-3xl mb-8">Friends</h1>

      {/* SEARCH */}

      <div className="mb-10">

        <input
          placeholder="Search users..."
          className="bg-gray-900 px-4 py-2 mr-4"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 px-4 py-2"
        >
          Search
        </button>

        <div className="mt-4">

          {results.map((u)=>(
            <div key={u.id} className="flex gap-4 mb-3">

              <span>{u.username}</span>

              <button
                onClick={()=>sendFriendRequest(user.uid,u.id)}
                className="bg-green-600 px-3 py-1"
              >
                Add Friend
              </button>

            </div>
          ))}

        </div>

      </div>

      {/* REQUESTS */}

      <div className="mb-10">

        <h2 className="text-xl mb-4">Friend Requests</h2>

        {requests.map((r)=>(
          <div key={r.id} className="flex gap-4 mb-2">

            <span>{r.from}</span>

            <button
              onClick={()=>acceptFriendRequest(r.id,r.from,r.to)}
              className="bg-green-600 px-3 py-1"
            >
              Accept
            </button>

            <button
              onClick={()=>rejectFriendRequest(r.id)}
              className="bg-red-600 px-3 py-1"
            >
              Reject
            </button>

          </div>
        ))}

      </div>

      {/* FRIENDS */}

      <div>

        <h2 className="text-xl mb-4">My Friends</h2>

        {friends.map((f)=>(
          <div key={f.friendId} className="flex gap-4 mb-2">

<Link href={`/user/${f.friendId}`}>
  <span className="text-blue-400 hover:underline">
    {f.friendId}
  </span>
</Link>
            <button
              onClick={()=>removeFriend(user.uid,f.friendId)}
              className="bg-red-600 px-3 py-1"
            >
              Remove
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}