"use client"

import Image from "next/image"
import Link from "next/link"

interface Activity {
  userId: string
  username: string
  userAvatar?: string
  type: string
  movieId?: number
  movieTitle?: string
  poster?: string
  rating?: number
}

export default function ActivityCard({ activity }: { activity: Activity }) {

  const poster = activity.poster
    ? `https://image.tmdb.org/t/p/w500${activity.poster}`
    : "/poster-placeholder.png"

  function getText() {

    if (activity.type === "watched") {
      return "watched"
    }

    if (activity.type === "rated") {
      return "rated"
    }

    if (activity.type === "reviewed") {
      return "reviewed"
    }

    if (activity.type === "watchlist_add") {
      return "added to watchlist"
    }

    return activity.type
  }

  return (
<div className="flex gap-4 p-5 border-b border-white/10 hover:bg-white/5 transition">
      {/* Avatar */}

      <img
        src={activity.userAvatar || "/avatar.png"}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">

        {/* Activity Text */}

        <p className="text-sm text-gray-200">

          <span className="font-semibold">
            {activity.username || "User"}
          </span>{" "}

          {getText()}{" "}

          {activity.movieId ? (
            <Link
              href={`/movie/${activity.movieId}`}
              className="font-semibold hover:underline"
            >
              {activity.movieTitle || "a movie"}
            </Link>
          ) : (
            <span className="font-semibold">
              {activity.movieTitle || "a movie"}
            </span>
          )}

        </p>

        {/* Rating */}

        {activity.rating && (
          <p className="text-yellow-400 text-sm">
            ⭐ {activity.rating}/10
          </p>
        )}

        {/* Poster */}

        {activity.poster && activity.movieId && (
          <Link href={`/movie/${activity.movieId}`}>
            <Image
              src={poster}
              alt="poster"
              width={80}
              height={120}
              className="mt-2 rounded hover:scale-105 transition"
            />
          </Link>
        )}

      </div>

    </div>
  )
}