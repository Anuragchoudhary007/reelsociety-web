"use client"

import MovieCard from "./MovieCard"

export default function MovieRow({movies,loading}:any){

  if(loading){

    return(

      <div className="flex gap-4 overflow-x-auto pb-6">

        {[...Array(10)].map((_,i)=>(
          <div
            key={i}
            className="min-w-[160px] h-[240px] bg-gray-800 rounded-lg animate-pulse"
          />
        ))}

      </div>

    )

  }

  if(!movies || movies.length===0) return null

  return(

    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">

      {movies.map((movie:any)=>(

        <MovieCard
          key={movie.id}
          movie={movie}
        />

      ))}

    </div>

  )

}