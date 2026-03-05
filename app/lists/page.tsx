"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ListsPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "lists"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const listsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const listId = docSnap.id;

          // fetch preview items
          const itemsQuery = query(
            collection(
              db,
              "users",
              user.uid,
              "lists",
              listId,
              "items"
            ),
            orderBy("rank"),
            limit(4)
          );

          const itemsSnap = await getDocs(itemsQuery);

          return {
            id: listId,
            ...docSnap.data(),
            preview: itemsSnap.docs.map((d) => d.data()),
            count: itemsSnap.size,
          };
        })
      );

      setLists(listsData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Your Lists
        </h1>

        <Link
          href="/create-list"
          className="px-6 py-2 bg-white text-black rounded-xl hover:scale-105 transition"
        >
          + Create List
        </Link>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-400">
          No lists yet. Start building your rankings.
        </p>
      ) : (
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:-translate-y-2 transition duration-300"
            >
              {/* Poster Collage */}
              <div className="h-48 bg-black grid grid-cols-2 grid-rows-2">
                {list.preview.map((item: any, i: number) => (
                  <img
                    key={i}
                    src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                    className="object-cover w-full h-full"
                  />
                ))}
              </div>

              {/* Info Section */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold group-hover:text-white transition">
                    {list.name}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      list.isPublic
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {list.isPublic ? "Public" : "Private"}
                  </span>
                </div>

                <p className="text-sm text-gray-400">
                  {list.preview.length} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}