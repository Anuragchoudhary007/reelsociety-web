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

  const avatar =
    activity.userAvatar ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${activity.username || "user"}`

  const poster = activity.poster
    ? `https://image.tmdb.org/t/p/w500${activity.poster}`
    : "/poster-placeholder.png"

  function getText() {

    switch (activity.type) {

      case "watched":
        return "watched"

      case "rated":
        return "rated"

      case "reviewed":
        return "reviewed"

      case "watchlist_add":
        return "added to watchlist"

      default:
        return activity.type
    }
  }

  return (

    <div className="flex gap-4 p-5 border-b border-white/10 hover:bg-white/5 transition rounded-lg">

      {/* Avatar */}

      <img
        src={avatar}
        className="w-10 h-10 rounded-full bg-zinc-800"
      />

      <div className="flex-1">

        {/* Activity text */}

        <p className="text-sm text-gray-200 leading-relaxed">

          <span className="font-semibold hover:text-blue-400 cursor-pointer">
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
          <p className="text-yellow-400 text-sm mt-1">
            ⭐ {activity.rating}/10
          </p>
        )}

        {/* Poster */}

        {activity.poster && activity.movieId && (

          <Link href={`/movie/${activity.movieId}`}>

            <Image
              src={poster}
              alt="poster"
              width={90}
              height={130}
              className="mt-3 rounded-lg hover:scale-105 transition"
            />

          </Link>

        )}

      </div>

    </div>

  )

}