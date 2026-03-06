"use client"

import Link from "next/link"

const IMAGE = "https://image.tmdb.org/t/p/w300"

export default function ActivityRow({activities}:any){

  return(

    <div className="mb-12">

      <h2 className="text-2xl mb-4">
        👥 Friends Activity
      </h2>

      <div className="flex gap-4 overflow-x-auto">

        {activities?.map((a:any)=>(

          <Link
            key={a.id}
            href={`/movie/${a.movieId}`}
            className="min-w-[180px]"
          >

            <img
              src={`${IMAGE}${a.poster_path}`}
              className="rounded-lg"
            />

            <p className="text-sm mt-2">
              {a.username} {a.type}
            </p>

          </Link>

        ))}

      </div>

    </div>

  )
}