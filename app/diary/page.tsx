"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const IMAGE_BASE = "https://image.tmdb.org/t/p/w300"

export default function DiaryPage() {

  const { user } = useAuth()

  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (!user) return

    async function loadDiary() {

      try {

        const q = query(
          collection(db, "users", user.uid, "watched"),
          orderBy("watchedAt", "desc")
        )

        const snap = await getDocs(q)

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setEntries(data)

      } catch (err) {

        console.error("Diary load failed:", err)

      }

      setLoading(false)

    }

    loadDiary()

  }, [user])


  function formatDate(date: any) {

    if (!date?.toDate) return "Unknown date"

    return date
      .toDate()
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })

  }


  if (loading) {

    return (

      <div className="max-w-5xl mx-auto p-10 text-white">
        Loading diary...
      </div>

    )

  }


  return (

    <div className="max-w-5xl mx-auto p-10 text-white">

      {/* Header */}

      <h1 className="text-3xl font-bold mb-10">
        📓 Movie Diary
      </h1>


      {/* Entries */}

      <div className="space-y-6">

        {entries.length > 0 ? (

          entries.map(entry => (

            <div
              key={entry.id}
              className="bg-white/5 border border-white/10 p-5 rounded-xl flex gap-6 items-center hover:bg-white/10 transition"
            >

              {/* Poster */}

              <Link href={`/movie/${entry.movieId || entry.id}`}>

                {entry.poster_path ? (

                  <img
                    src={`${IMAGE_BASE}${entry.poster_path}`}
                    alt={entry.title || "Movie"}
                    className="w-24 rounded-lg shadow-lg hover:scale-105 transition"
                  />

                ) : (

                  <div className="w-24 h-[140px] bg-gray-800 rounded-lg animate-pulse" />

                )}

              </Link>


              {/* Info */}

              <div className="flex-grow">

                <Link href={`/movie/${entry.movieId || entry.id}`}>

                  <h3 className="text-xl font-semibold hover:text-blue-400 transition">

                    {entry.title || entry.movieTitle || "Untitled Movie"}

                  </h3>

                </Link>


                <div className="flex items-center gap-4 mt-2">

                  {/* Date */}

                  <span className="text-gray-400 text-sm">

                    📅 {formatDate(entry.watchedAt)}

                  </span>


                  {/* Rating */}

                  {entry.rating && (

                    <span className="text-yellow-400 text-sm font-medium">

                      ⭐ {entry.rating}/10

                    </span>

                  )}

                </div>


                {/* Optional notes (future feature ready) */}

                {entry.note && (

                  <p className="text-gray-400 text-sm mt-2">

                    {entry.note}

                  </p>

                )}

              </div>


              {/* Badge */}

              <div className="hidden md:block text-xs text-gray-500">

                Watched

              </div>

            </div>

          ))

        ) : (

          <div className="text-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10">

            <div className="text-5xl mb-4">
              🎬
            </div>

            <p className="text-gray-400">
              Your diary is empty
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Start watching movies to fill your diary
            </p>

          </div>

        )}

      </div>

    </div>

  )

}