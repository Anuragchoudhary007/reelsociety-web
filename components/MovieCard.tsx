"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import WatchlistButton from "./WatchlistButton"
import MovieRating from "./MovieRating"

const IMAGE = "https://image.tmdb.org/t/p/w500"

export default function MovieCard({ movie }: any) {
  const [hover, setHover] = useState(false)
  const [video, setVideo] = useState<any>(null)
  const [details, setDetails] = useState<any>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768)
    
    if (!hover) return

    async function load() {
      try {
        const res = await fetch(`/api/movie/${movie.id}`)
        const data = await res.json()
        setDetails(data)

        const vid = data.videos?.results?.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        )
        setVideo(vid)
      } catch (e) {
        console.error(e)
      }
    }

    load()
  }, [hover, movie.id])

  return (
    <div
      className="relative w-[130px] h-[200px] sm:w-[160px] sm:h-[240px] cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
src={
  movie.poster_path
  ? `${IMAGE}${movie.poster_path}`
  : "/poster.png"
}        alt={movie.title || movie.name}
        className={`absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-all duration-300 ${
          hover && isDesktop ? "scale-110 opacity-0" : "scale-100 opacity-100"
        }`}
      />

      {hover && isDesktop && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[#141414] rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 scale-100 animate-in fade-in zoom-in">
          <div className="relative h-44 w-full">
            {video ? (
              <iframe
                className="w-full h-full pointer-events-none"
                src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.key}`}
                allow="autoplay"
              />
            ) : (
              <img
                src={movie.backdrop_path ? IMAGE + movie.backdrop_path : IMAGE + movie.poster_path}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white truncate pr-2">
                {movie.title || movie.name}
              </h3>
              <span className="text-xs font-medium text-green-400">
                {movie.vote_average?.toFixed(1)} Rating
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/movie/${movie.id}`}
                className="flex-1 text-center py-2 bg-white text-black text-xs font-bold rounded hover:bg-white/90 transition"
              >
                View Details
              </Link>
              <WatchlistButton movie={movie} />
            </div>

            <MovieRating
              movieId={movie.id}
              movieTitle={movie.title || movie.name}
            />

            {details?.overview && (
              <p className="text-[10px] text-gray-400 line-clamp-3 leading-relaxed">
                {details.overview}
              </p>
            )}

            {details?.genres && (
              <div className="flex flex-wrap gap-1">
                {details.genres.slice(0, 3).map((g: any) => (
                  <span key={g.id} className="text-[9px] text-gray-500 border border-white/10 px-1 rounded">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}