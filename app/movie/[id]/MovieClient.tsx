"use client"

import { useState } from "react"
import Image from "next/image"
import AddToListModal from "@/components/AddToListModal"

interface Props {
  movie: any
}

export default function MovieClient({ movie }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="relative min-h-screen">

      {/* BACKDROP */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-bg" />
      </div>

      <div className="px-10 py-32 flex gap-16">

        <div className="w-[300px] flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg shadow-2xl"
          />
        </div>

        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif mb-6">
            {movie.title}
          </h1>

          <div className="flex gap-6 text-textSoft mb-6 text-sm">
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>

          <p className="text-textSoft mb-10 leading-relaxed">
            {movie.overview}
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 border border-zinc-700 px-6 py-3 rounded-lg hover:border-white transition"
          >
            + Add to Collection
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddToListModal
          movie={movie}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}