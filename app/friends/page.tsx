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

      if (!user) return;

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

    <div className="max-w-4xl">

      <h1 className="text-3xl font-bold mb-8">
        Friends
      </h1>


      {/* SEARCH */}

      <div className="mb-12">

        <h2 className="text-xl mb-4">
          Add Friends
        </h2>

        <div className="flex gap-3 mb-4">

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-gray-900 px-4 py-2 rounded-lg w-72"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Search
          </button>

        </div>


        {results.map((u)=>(
          <div
            key={u.id}
            className="flex justify-between bg-white/5 px-4 py-3 rounded-lg mb-3"
          >

            <span>{u.username}</span>

            <button
              onClick={()=>sendFriendRequest(user!.uid,u.id)}
              className="bg-green-600 px-3 py-1 rounded"
            >
              Add
            </button>

          </div>
        ))}

      </div>


      {/* FRIEND REQUESTS */}

      <div className="mb-12">

        <h2 className="text-xl mb-4">
          Friend Requests
        </h2>

        {requests.map((r)=>(
          <FriendRequestCard key={r.id} request={r} />
        ))}

      </div>


      {/* FRIEND LIST */}

      <div>

        <h2 className="text-xl mb-4">
          My Friends
        </h2>

        {friends.map((f)=>(
<FriendCard key={f.friendId + "_friend"} friend={f} user={user} />        ))}

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

    <div className="flex justify-between bg-white/5 px-4 py-3 rounded-lg mb-3">

      <span>{profile?.username || request.from}</span>

      <div className="flex gap-3">

        <button
          onClick={()=>acceptFriendRequest(request.id,request.from,request.to)}
          className="bg-green-600 px-3 py-1 rounded"
        >
          Accept
        </button>

        <button
          onClick={()=>rejectFriendRequest(request.id)}
          className="bg-red-600 px-3 py-1 rounded"
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

    <div className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg mb-3 hover:bg-white/10 transition">

      <Link href={`/user/${friend.friendId}`}>
        <span className="text-blue-400 hover:underline">
          {profile?.username || friend.friendId}
        </span>
      </Link>

      <button
        onClick={()=>removeFriend(user.uid,friend.friendId)}
        className="bg-red-600 px-3 py-1 rounded"
      >
        Remove
      </button>

    </div>

  )

}