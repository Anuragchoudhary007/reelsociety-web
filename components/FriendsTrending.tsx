"use client"

import { useEffect, useState } from "react"
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import MovieCard from "./MovieCard"

export default function FriendsTrending() {

  const [movies, setMovies] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      const q = query(
        collectionGroup(db, "watched"),
        orderBy("watchedAt", "desc"),
        limit(12)
      )

      const snap = await getDocs(q)

      const formatted = snap.docs.map(doc => {

        const data = doc.data()

        return {
          id: data.movieId,
          title: data.movieTitle,
          poster_path: data.poster
        }

      })

      setMovies(formatted)

    }

    load()

  }, [])

  if (!movies.length) return null

  return (

    <section>

      <h2 className="text-xl font-semibold mb-5 text-white">
        👥 Trending Among Friends
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">

      {movies.map((movie, index) => (
  <MovieCard key={movie.id + "-" + index} movie={movie} />
))}

      </div>

    </section>

  )

}