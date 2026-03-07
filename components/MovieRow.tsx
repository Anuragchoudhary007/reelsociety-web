"use client"

import Link from "next/link"

const POSTER = "https://image.tmdb.org/t/p/w500"
const BACKDROP = "https://image.tmdb.org/t/p/w780"

export default function MovieRow({ title, movies }: any) {

  return (

    <div className="mb-14">

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">

        {movies.map((movie:any)=>{

          const poster = movie.poster_path
            ? `${POSTER}${movie.poster_path}`
            : "/poster.png"

          const backdrop = movie.backdrop_path
            ? `${BACKDROP}${movie.backdrop_path}`
            : poster

          return (

            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group flex-shrink-0"
            >

              {/* MOBILE POSTER */}

              <div className="w-[110px] md:hidden">

                <img
                  src={poster}
                  className="rounded-lg shadow-lg transition group-hover:scale-105"
                />

              </div>

              {/* DESKTOP CARD */}

              <div className="hidden md:block w-[260px] lg:w-[300px]">

                <div className="relative overflow-hidden rounded-xl">

                  <img
                    src={backdrop}
                    className="w-full h-[150px] object-cover transition duration-300 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">

                    <p className="text-sm font-semibold truncate">
                      {movie.title}
                    </p>

                  </div>

                </div>

              </div>

            </Link>

          )

        })}

      </div>

    </div>

  )

}