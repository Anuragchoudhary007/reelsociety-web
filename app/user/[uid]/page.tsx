"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import Link from "next/link"

export default function UserProfilePage() {
  const params = useParams()
  const uid = params.uid as string

  const [profile, setProfile] = useState<any>(null)
  const [lists, setLists] = useState<any[]>([])
  const [watched, setWatched] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return

    async function load() {
      try {
        const userSnap = await getDoc(doc(db, "users", uid))
        if (userSnap.exists()) {
          setProfile(userSnap.data())
        }

        const watchSnap = await getDocs(collection(db, "users", uid, "watched"))
        setWatched(watchSnap.size)

        const listSnap = await getDocs(collection(db, "users", uid, "lists"))
        setLists(listSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        })))
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [uid])

  if (loading) return <div className="p-10 text-gray-500">Loading profile...</div>
  if (!profile) return <div className="p-10 text-gray-500">User not found.</div>

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white/5 p-8 rounded-3xl border border-white/10">
        <img
          src={profile.photoURL || "/avatar.png"}
          alt={profile.username}
          className="w-32 h-32 rounded-full border-4 border-white/10 object-cover"
        />

        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-bold text-white mb-2">
            {profile.username}
          </h1>
          <p className="text-gray-400 max-w-md">
            {profile.bio || "No bio yet."}
          </p>
        </div>

        <div className="flex gap-8 border-l border-white/10 pl-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{watched}</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Watched</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{lists.length}</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Lists</p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
          Public Lists
        </h2>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="group bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-white/30 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition">
                  {list.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {list.count || 0} items
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
            No public lists created yet.
          </div>
        )}
      </section>
    </div>
  )
}