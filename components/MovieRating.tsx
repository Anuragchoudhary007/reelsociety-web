"use client"

import { useState,useEffect } from "react"
import { doc,setDoc,getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { createActivity } from "@/services/activityService"

export default function MovieRating({movieId,movieTitle}:any){

  const {user} = useAuth()
  const [rating,setRating] = useState(0)

  useEffect(()=>{

    async function fetchRating(){

      if(!user) return

      const snap = await getDoc(
        doc(db,"users",user.uid,"ratings",String(movieId))
      )

      if(snap.exists()){
        setRating(snap.data().rating)
      }

    }

    fetchRating()

  },[user,movieId])

  const handleRate = async(value:number)=>{

    if(!user){
      window.location.href="/login"
      return
    }

    await setDoc(
      doc(db,"users",user.uid,"ratings",String(movieId)),
      {
        movieId,
        rating:value,
        createdAt:new Date()
      }
    )

    await createActivity(
      user.uid,
      "rated",
      {id:movieId,title:movieTitle},
      {rating:value}
    )

    setRating(value)

  }

  return(

    <div className="flex gap-2 mt-4">

      {[1,2,3,4,5,6,7,8,9,10].map(num=>(

        <button
          key={num}
          onClick={()=>handleRate(num)}
          className={`px-3 py-1 rounded-md ${
            rating>=num
              ?"bg-yellow-500 text-black"
              :"border border-white/30"
          }`}
        >
          {num}
        </button>

      ))}

    </div>

  )

}