"use client"

import { useEffect,useState } from "react"
import { collection,getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

export default function FriendsList(){

  const {user} = useAuth()
  const [friends,setFriends] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      if(!user) return

      const snap = await getDocs(
        collection(db,"users",user.uid,"friends")
      )

      setFriends(snap.docs.map(d=>d.data()))

    }

    load()

  },[user])

  if(!friends.length) return null

  return(

    <div>

      <h2 className="text-xl mb-4">🤝 Friends</h2>

      <div className="flex gap-4">

        {friends.map(friend=>(

          <div
            key={friend.uid}
            className="flex items-center gap-2 bg-[#141414] p-2 rounded"
          >

            <img
              src={friend.avatar || "/avatar.png"}
              className="w-8 h-8 rounded-full"
            />

            <p className="text-sm">{friend.name}</p>

          </div>

        ))}

      </div>

    </div>

  )

}