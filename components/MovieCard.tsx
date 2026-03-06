"use client"

import { useState,useEffect } from "react"
import Link from "next/link"
import WatchlistButton from "./WatchlistButton"
import MovieRating from "./MovieRating"

const IMAGE="https://image.tmdb.org/t/p/w500"

export default function MovieCard({movie}:any){

  const [hover,setHover]=useState(false)
  const [video,setVideo]=useState<any>(null)
  const [details,setDetails]=useState<any>(null)

  useEffect(()=>{

    if(!hover) return

    async function load(){

      try{

        const res=await fetch(`/api/movie/${movie.id}`)
        const data=await res.json()

        setDetails(data)

        const vid=data.videos?.results?.find(
          (v:any)=>v.type==="Trailer" && v.site==="YouTube"
        )

        setVideo(vid)

      }catch(e){
        console.error(e)
      }

    }

    load()

  },[hover,movie.id])


  return(

    <div
      className="relative min-w-[160px] h-[240px] cursor-pointer"
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
    >

      {/* Poster */}

     <Link href={`/movie/${movie.id}`}>
  <img
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    className="w-[160px] h-[240px] object-cover rounded-lg hover:scale-105 transition cursor-pointer"
  />
</Link>


      {/* Hover Card */}

      {hover &&(

        <div className="absolute -top-20 left-0 w-[320px] bg-[#141414] rounded-xl shadow-2xl z-30 overflow-hidden animate-fade">

          {/* Trailer */}

          {video?(
            <iframe
              className="w-full h-44 pointer-events-none"
              src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.key}`}
              allow="autoplay"
            />
          ):(
            <img
              src={
                movie.poster_path
                  ? IMAGE+movie.poster_path
                  : "/placeholder.png"
              }
              className="w-full h-44 object-cover"
            />
          )}

          {/* Info */}

          <div className="p-4 space-y-3">

            <div className="flex justify-between items-center">

              <h3 className="text-sm font-semibold">
                {movie.title || movie.name}
              </h3>

              <span className="text-xs text-gray-400">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

            </div>


            {/* Buttons */}

            <div className="flex gap-2">

              <Link
                href={`/movie/${movie.id}`}
                className="px-3 py-1 bg-white text-black text-xs rounded"
              >
                ▶ Play
              </Link>

              <WatchlistButton movie={movie}/>

            </div>


            {/* Rating */}

            <MovieRating
              movieId={movie.id}
              movieTitle={movie.title || movie.name}
            />


            {/* Overview */}

            {details?.overview &&(

              <p className="text-xs text-gray-400 line-clamp-3">
                {details.overview}
              </p>

            )}

          </div>

        </div>

      )}

    </div>

  )

}