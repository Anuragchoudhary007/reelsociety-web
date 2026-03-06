"use client"

import { useEffect,useState } from "react"
import { collection,getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import MovieCard from "./MovieCard"

export default function ProfileWatched(){

  const {user} = useAuth()
  const [movies,setMovies] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      if(!user) return

      const snap = await getDocs(
        collection(db,"users",user.uid,"watched")
      )

      const data = snap.docs.map(doc=>doc.data())

      setMovies(data)

    }

    load()

  },[user])

  return(

    <div>

      <h2 className="text-xl mb-6">🎬 Diary</h2>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">

        {movies.map(movie=>(
          <MovieCard key={movie.movieId} movie={movie}/>
        ))}

      </div>

    </div>

  )

}