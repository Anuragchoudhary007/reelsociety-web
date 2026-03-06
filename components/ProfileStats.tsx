"use client"

import { useEffect,useState } from "react"
import { collection,getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

export default function ProfileStats(){

  const {user} = useAuth()

  const [watched,setWatched] = useState(0)
  const [ratings,setRatings] = useState(0)

  useEffect(()=>{

    async function load(){

      if(!user) return

      const watchedSnap = await getDocs(
        collection(db,"users",user.uid,"watched")
      )

      const ratingSnap = await getDocs(
        collection(db,"users",user.uid,"ratings")
      )

      setWatched(watchedSnap.size)
      setRatings(ratingSnap.size)

    }

    load()

  },[user])

  return(

    <div className="flex gap-10 text-center">

      <div>
        <p className="text-2xl font-bold">{watched}</p>
        <p className="text-gray-400 text-sm">Watched</p>
      </div>

      <div>
        <p className="text-2xl font-bold">{ratings}</p>
        <p className="text-gray-400 text-sm">Ratings</p>
      </div>

    </div>

  )

}