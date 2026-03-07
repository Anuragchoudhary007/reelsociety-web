"use client"

import { useEffect, useState } from "react"
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

export default function WatchlistButton({ movie }: any) {

  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {

    if (!user || !movie?.id) return

    async function checkWatchlist() {

      const ref = doc(
        db,
        "users",
        user.uid,
        "watchlist",
        String(movie.id)
      )

      const snap = await getDoc(ref)

      setSaved(snap.exists())

    }

    checkWatchlist()

  }, [user, movie?.id])

  async function toggleWatchlist() {

    if (!user || !movie?.id) {
      alert("Login required")
      return
    }

    setLoading(true)

    const ref = doc(
      db,
      "users",
      user.uid,
      "watchlist",
      String(movie.id)
    )

    try {

      if (saved) {

        await deleteDoc(ref)
        setSaved(false)

      } else {

        await setDoc(ref, {

          movieId: movie.id,
          title: movie.title || movie.name || "Unknown Movie",
          poster_path: movie.poster_path || null,
          backdrop_path: movie.backdrop_path || null,
          rating: movie.vote_average || null,
          addedAt: serverTimestamp()

        })

        setSaved(true)

      }

    } catch (err) {

      console.error("Watchlist error:", err)

    }

    setLoading(false)

  }

  return (

    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`px-6 py-3 rounded-md transition border ${
        saved
          ? "bg-green-600 border-green-500 hover:bg-green-500"
          : "border-white/30 hover:bg-white/10"
      }`}
    >

      {saved ? "✓ In Watchlist" : "+ Watchlist"}

    </button>

  )
}