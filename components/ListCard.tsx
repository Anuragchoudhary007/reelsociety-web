"use client"

import Link from "next/link"

const IMAGE = "https://image.tmdb.org/t/p/w500"

export default function ListCard({ list, uid }: any) {

  const poster = list.preview?.[0]?.poster_path || list.preview?.[0]?.poster

  return (
    <Link
      href={`/lists/${uid}/${list.id}`}
      className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:-translate-y-2 transition duration-300"
    >

      {/* COVER */}

      <div className="h-64 bg-gray-900 overflow-hidden">

        {poster ? (
          <img
            src={`${IMAGE}${poster}`}
            alt={list.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <span className="text-sm font-medium">
              Empty List
            </span>
          </div>
        )}

      </div>

      {/* INFO */}

      <div className="p-5">

        <div className="flex justify-between items-center mb-2">

          <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition truncate pr-2">
            {list.title}
          </h2>

          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border font-bold ${
              list.isPublic
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-gray-500/10 border-gray-500/20 text-gray-400"
            }`}
          >
            {list.isPublic ? "Public" : "Private"}
          </span>

        </div>

        <p className="text-sm text-gray-400">
          {list.count || 0} movies
        </p>

      </div>

    </Link>
  )
}