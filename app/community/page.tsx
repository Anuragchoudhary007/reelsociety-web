"use client"

import { useEffect, useState } from "react"
import {
  collection,
  collectionGroup,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import ActivityCard from "@/components/ActivityCard"

export default function CommunityPage() {

  const [activities, setActivities] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  /* ================= ACTIVITY FEED ================= */

  useEffect(() => {

    async function fetchActivities() {

      const q = query(
        collection(db, "activity"),
        orderBy("createdAt", "desc")
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      setActivities(data)
    }

    fetchActivities()

  }, [])

  /* ================= LEADERBOARD ================= */

  useEffect(() => {

    async function fetchLeaderboard() {

      const snap = await getDocs(
        collectionGroup(db, "watched")
      )

      const countMap: Record<string, number> = {}

      snap.forEach((docSnap) => {

        const uid = docSnap.ref.parent.parent?.id
        if (!uid) return

        countMap[uid] = (countMap[uid] || 0) + 1
      })

      const users = await Promise.all(
        Object.entries(countMap).map(async ([uid, count]) => {

          const userSnap = await getDoc(doc(db, "users", uid))

          return {
            uid,
            ...(userSnap.data() || {}),
            watchedCount: count
          }

        })
      )

      setLeaderboard(
        users.sort((a, b) => b.watchedCount - a.watchedCount).slice(0, 10)
      )
    }

    fetchLeaderboard()

  }, [])

  function getBadge(count: number) {

    if (count >= 300) return "👑 Cinema God"
    if (count >= 150) return "🔥 Binge King"
    if (count >= 75) return "⭐ Top Critic"
    if (count >= 30) return "🎬 Cinephile"

    return "🎟 Explorer"
  }

  return (
    <div className="p-10 flex gap-10">

      {/* Activity Feed */}

      <div className="w-2/3">

        <h2 className="text-3xl font-bold mb-8">
          📊 Activity Feed
        </h2>

        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
          />
        ))}

      </div>

      {/* Leaderboard */}

      <div className="w-1/3">

        <h2 className="text-3xl font-bold mb-8">
          🏆 Leaderboard
        </h2>

        {leaderboard.map((user, index) => (

          <div
            key={user.uid}
            className="bg-white/5 border border-white/10 p-4 rounded-xl mb-4 flex items-center gap-4"
          >

            <span className="text-yellow-400 font-bold">
              #{index + 1}
            </span>

            <img
              src={user.photoURL || "/avatar.png"}
              className="w-8 h-8 rounded-full"
            />

            <div>
              <div>{user.username}</div>

              <div className="text-sm text-yellow-400">
                {getBadge(user.watchedCount)}
              </div>
            </div>

            <div className="ml-auto font-bold">
              {user.watchedCount}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}