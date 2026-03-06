"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

const IMAGE_BASE = "https://image.tmdb.org/t/p/w200"

export default function DiaryPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    async function load() {
      const q = query(
        collection(db, "users", user.uid, "watched"),
        orderBy("watchedAt", "desc")
      )

      const snap = await getDocs(q)
      setEntries(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      )
    }

    load()
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Movie Diary
      </h1>

      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div
              key={entry.id}
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-6 items-center hover:bg-white/10 transition"
            >
              <div className="flex-shrink-0">
                {entry.poster ? (
                  <img
                    src={`${IMAGE_BASE}${entry.poster}`}
                    alt={entry.title}
                    className="w-20 rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-30 bg-gray-800 rounded-lg animate-pulse" />
                )}
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {entry.title || "Untitled Movie"}
                </h3>
                
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 text-sm">
                    {entry.watchedAt?.toDate?.() 
                      ? entry.watchedAt.toDate().toDateString() 
                      : "Date unknown"}
                  </p>
                  
                  {entry.rating && (
                    <span className="text-yellow-500 text-sm font-medium">
                      ★ {entry.rating}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-gray-600 text-xs font-mono">
                ID: {entry.id.slice(0, 8)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-gray-500">Your diary is empty. Start logging movies!</p>
          </div>
        )}
      </div>
    </div>
  )
}