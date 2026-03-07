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

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {

    if (!user?.uid) return;

    async function load() {

      const req = await getFriendRequests(user.uid);
      const fr = await getFriends(user.uid);

      setRequests(req);
      setFriends(fr);

    }

    load();

  }, [user?.uid]);


  async function handleSearch() {

    if (!search) return;

    const users = await searchUsers(search);
    setResults(users);

  }


  return (

    <div className="max-w-5xl mx-auto text-white px-4">

      <h1 className="text-3xl font-bold mb-10">
        Friends
      </h1>


      {/* SEARCH */}

      <div className="mb-12 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Add Friends
        </h2>

        <div className="flex gap-3 mb-6">

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg w-80 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>

        </div>


        {results.map((u)=>(
          <div
            key={u.id}
            className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg mb-3 hover:bg-zinc-700 transition"
          >

            <div className="flex items-center gap-3">

              <img
                src={u.photoURL || "/avatar.png"}
                className="w-8 h-8 rounded-full"
              />

              <span>{u.username}</span>

            </div>

            <button
              onClick={()=>sendFriendRequest(user!.uid,u.id)}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Add
            </button>

          </div>
        ))}

      </div>


      {/* FRIEND REQUESTS */}

      <div className="mb-12">

        <h2 className="text-lg font-semibold mb-4">
          Friend Requests
        </h2>

        <div className="space-y-3">

          {requests.length === 0 && (
            <p className="text-zinc-500">
              No friend requests
            </p>
          )}

          {requests.map((r)=>(
            <FriendRequestCard key={r.id} request={r} />
          ))}

        </div>

      </div>


      {/* FRIEND LIST */}

      <div>

        <h2 className="text-lg font-semibold mb-4">
          My Friends
        </h2>

        <div className="space-y-3">

          {friends.length === 0 && (
            <p className="text-zinc-500">
              You don't have friends yet.
            </p>
          )}

          {friends.map((f)=>(
            <FriendCard key={f.friendId + "_friend"} friend={f} user={user} />
          ))}

        </div>

      </div>

    </div>

  );

}



function FriendRequestCard({request}:any){

  const [profile,setProfile] = useState<any>(null)

  useEffect(()=>{

    async function load(){

      const snap = await getDoc(
        doc(db,"users",request.from)
      )

      if(snap.exists()){
        setProfile(snap.data())
      }

    }

    load()

  },[])

  return(

    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl hover:border-zinc-600 transition">

      <div className="flex items-center gap-3">

        <img
          src={profile?.photoURL || "/avatar.png"}
          className="w-9 h-9 rounded-full"
        />

        <span>{profile?.username || request.from}</span>

      </div>

      <div className="flex gap-3">

        <button
          onClick={()=>acceptFriendRequest(request.id,request.from,request.to)}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Accept
        </button>

        <button
          onClick={()=>rejectFriendRequest(request.id)}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Reject
        </button>

      </div>

    </div>

  )

}



function FriendCard({friend,user}:any){

  const [profile,setProfile] = useState<any>(null)

  useEffect(()=>{

    async function load(){

      const snap = await getDoc(
        doc(db,"users",friend.friendId)
      )

      if(snap.exists()){
        setProfile(snap.data())
      }

    }

    load()

  },[])

  return(

    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl hover:border-zinc-600 transition">

      <Link href={`/user/${friend.friendId}`}>

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src={profile?.photoURL || "/avatar.png"}
            className="w-9 h-9 rounded-full"
          />

          <span className="text-blue-400 hover:underline">
            {profile?.username || friend.friendId}
          </span>

        </div>

      </Link>

      <button
        onClick={()=>removeFriend(user.uid,friend.friendId)}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Remove
      </button>

    </div>

  )

}