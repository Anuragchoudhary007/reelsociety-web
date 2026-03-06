"use client"

import Link from "next/link"

const IMAGE = "https://image.tmdb.org/t/p/w500"

export default function ListCard({ list }: any) {

  const poster = list.preview?.[0]?.poster_path

  return (

    <Link
      href={`/lists/${list.id}`}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:-translate-y-2 transition duration-300"
    >

      <div className="h-64">

        {poster ? (

          <img
            src={`${IMAGE}${poster}`}
            alt={list.name}
            className="w-full h-full object-cover"
          />

        ) : (

          <div className="w-full h-full bg-gray-900" />

        )}

      </div>

      <div className="p-5">

        <div className="flex justify-between items-center mb-2">

          <h2 className="text-lg font-semibold group-hover:text-white transition">
            {list.name}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              list.isPublic
                ? "bg-green-600/20 text-green-400"
                : "bg-gray-600/20 text-gray-400"
            }`}
          >
            {list.isPublic ? "Public" : "Private"}
          </span>

        </div>

        <p className="text-sm text-gray-400">
          {list.count || 0} items
        </p>

      </div>

    </Link>

  )

}