"use client"

import { useEffect, useState } from "react"

const IMAGE = "https://image.tmdb.org/t/p/original"

interface Movie {
  title: string
  backdrop_path: string
  overview: string
}

export default function HeroCarousel(){

  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(()=>{

    async function load(){

     const res = await fetch("/api/tmdb/trending")

if (!res.ok) return

const data = await res.json()

setMovie(data[0])

    }

    load()

  },[])

  if(!movie) return null

  return(

    <div
      className="h-[70vh] flex items-end"
      style={{
        backgroundImage:`url(${IMAGE + movie.backdrop_path})`,
        backgroundSize:"cover",
        backgroundPosition:"center"
      }}
    >

      <div className="bg-black/60 p-16 max-w-xl">

        <h1 className="text-5xl font-bold mb-4">
          {movie.title}
        </h1>

        <p className="text-gray-300">
          {movie.overview}
        </p>

      </div>

    </div>

  )

}