"use client"

import Image from "next/image"

interface Activity {
  userId: string
  username: string
  userAvatar?: string
  type: string
  movieTitle: string
  poster_path?: string
  rating?: number
}

export default function ActivityCard({ activity }: { activity: Activity }) {

const poster = activity.poster_path
  ? `https://image.tmdb.org/t/p/w500${activity.poster_path}`
  : "/poster-placeholder.png"
  function getText() {
    if (activity.type === "watched") {
      return `watched`
    }

    if (activity.type === "rated") {
      return `rated`
    }

    if (activity.type === "reviewed") {
      return `reviewed`
    }

    if (activity.type === "watchlist") {
      return `added to watchlist`
    }

    return activity.type
  }

  return (
    <div className="flex gap-4 p-4 border-b border-white/10">

      {/* Avatar */}
      <img
        src={activity.userAvatar || "/avatar.png"}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">

        {/* Text */}
        <p className="text-sm text-gray-200">
          <span className="font-semibold">{activity.username}</span>{" "}
          {getText()}{" "}
          <span className="font-semibold">{activity.movieTitle}</span>
        </p>

        {/* Rating */}
        {activity.rating && (
          <p className="text-yellow-400 text-sm">
            ⭐ {activity.rating}/10
          </p>
        )}

        {/* Poster */}
        {activity.poster_path && (
          <Image
            src={poster}
            alt="poster"
            width={80}
            height={120}
            className="mt-2 rounded"
          />
        )}

      </div>
    </div>
  )
}