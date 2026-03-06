"use client"

import { useEffect,useState } from "react"
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import MovieCard from "./MovieCard"

export default function FriendsActivityRow(){

  const [movies,setMovies] = useState<any[]>([])

  useEffect(()=>{

    const q = query(
      collectionGroup(db,"activity"),
      orderBy("createdAt","desc"),
      limit(20)
    )

    const unsub = onSnapshot(q,(snap)=>{

      const activities = snap.docs.map(doc=>doc.data())

      const movieList = activities
        .filter(a=>a.movieId && a.poster)
        .map(a=>({
          id:a.movieId,
          title:a.movieTitle,
          poster_path:a.poster
        }))

      const unique = Array.from(
        new Map(movieList.map(m=>[m.id,m])).values()
      )

      setMovies(unique)

    })

    return ()=>unsub()

  },[])

  if(!movies.length) return null

  return(

    <div>

      <h2 className="text-xl font-semibold mb-5">
        👥 Friends Watching
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-6">

        {movies.map(movie=>(
          <MovieCard key={movie.id} movie={movie}/>
        ))}

      </div>

    </div>

  )

}