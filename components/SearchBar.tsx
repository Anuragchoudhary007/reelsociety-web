"use client"

import { useState,useEffect } from "react"
import Link from "next/link"

const IMAGE = "https://image.tmdb.org/t/p/w92"

export default function SearchBar(){

  const [query,setQuery] = useState("")
  const [results,setResults] = useState<any[]>([])
  const [open,setOpen] = useState(false)

  useEffect(()=>{

    if(query.length<2){
      setResults([])
      return
    }

    const timeout = setTimeout(async()=>{

      const res = await fetch(`/api/search?query=${query}`)
      const data = await res.json()

      setResults(data)

    },300)

    return ()=>clearTimeout(timeout)

  },[query])

  return(

    <div className="relative w-full max-w-md">

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e)=>{
          setQuery(e.target.value)
          setOpen(true)
        }}
        className="w-full px-4 py-2 rounded bg-[#141414] border border-white/10"
      />

      {open && results.length>0 &&(

        <div className="absolute top-12 left-0 w-full bg-[#141414] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">

          {results.map(movie=>(

            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="flex items-center gap-3 p-3 hover:bg-white/10"
            >

              <img
                src={
                  movie.poster_path
                    ? IMAGE+movie.poster_path
                    : "/placeholder.png"
                }
                className="w-10 rounded"
              />

              <div>

                <p className="text-sm font-medium">
                  {movie.title || movie.name}
                </p>

                <p className="text-xs text-gray-400">
                  {movie.release_date?.slice(0,4)}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>

  )

}