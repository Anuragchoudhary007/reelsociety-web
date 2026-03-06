"use client"

import { useEffect,useState } from "react"
import MovieCard from "./MovieCard"

export default function RecommendationRow({movieId}:any){

  const [movies,setMovies] = useState<any[]>([])

  useEffect(()=>{

    if(!movieId) return

    async function load(){

      try{

        const res = await fetch(
          `/api/recommendations?movie=${movieId}`
        )

        const data = await res.json()

        setMovies(data.slice(0,12))

      }catch(e){
        console.error(e)
      }

    }

    load()

  },[movieId])


  if(!movies.length) return null


  return(

    <section>

      <h2 className="text-2xl mb-6">
        🧠 Recommended For You
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-6">

        {movies.map(movie=>(
          <MovieCard key={movie.id} movie={movie}/>
        ))}

      </div>

    </section>

  )

}