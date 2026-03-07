"use client"

import HeroBanner from "./HeroBanner"
import LazyMovieRow from "./LazyMovieRow"
import RecommendationRow from "./RecommendationRow"
import FriendsTrending from "./FriendsTrending"
import DownloadApp from "./DownloadApp"
import { useState } from "react"

export default function CinematicHome() {

  const [recentWatchedMovieId, setRecentWatchedMovieId] = useState<number | null>(null)

  return (

    <>

      <HeroBanner />

      <div className="space-y-16 px-4 md:px-10 py-8">

        {recentWatchedMovieId && (
          <RecommendationRow movieId={recentWatchedMovieId} />
        )}

        <LazyMovieRow
          title="🔥 Trending"
          endpoint="/api/tmdb/trending"
        />

        <LazyMovieRow
          title="⭐ Top Rated"
          endpoint="/api/tmdb/top"
        />

        <FriendsTrending />

        <LazyMovieRow
          title="🎭 Action"
          endpoint="/api/tmdb/action"
        />

        <LazyMovieRow
          title="😂 Comedy"
          endpoint="/api/tmdb/comedy"
        />

        <LazyMovieRow
          title="👻 Horror"
          endpoint="/api/tmdb/horror"
        />

        <LazyMovieRow
          title="🚀 Sci-Fi"
          endpoint="/api/tmdb/scifi"
        />

        <LazyMovieRow
          title="🧙 Fantasy"
          endpoint="/api/tmdb/fantasy"
        />

        <LazyMovieRow
          title="🧠 Thriller"
          endpoint="/api/tmdb/thriller"
        />

        <LazyMovieRow
          title="🎬 Drama"
          endpoint="/api/tmdb/drama"
        />

        <DownloadApp />

      </div>

    </>

  )

}