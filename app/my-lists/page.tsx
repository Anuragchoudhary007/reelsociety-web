"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

interface ListData {
  id: string;
  name: string;
  posters: string[];
}

export default function MyLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      try {
        const listsRef = collection(db, "users", user.uid, "lists");
        const snapshot = await getDocs(query(listsRef, orderBy("createdAt")));

        const data: ListData[] = [];

        for (const docSnap of snapshot.docs) {
          const itemsRef = collection(
            db,
            "users",
            user.uid,
            "lists",
            docSnap.id,
            "items"
          );

          const itemsSnap = await getDocs(itemsRef);

          const posters = itemsSnap.docs
            .slice(0, 6)
            .map((item) => item.data().poster_path)
            .filter(Boolean)
            .map((path) => IMAGE_BASE + path);

          data.push({
            id: docSnap.id,
            name: docSnap.data().name || "Untitled List",
            posters,
          });
        }

        setLists(data);
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="min-h-screen bg-black text-white p-12">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white px-12 py-10">
      <h1 className="text-4xl font-serif mb-12">My Lists</h1>

      <div className="space-y-16">
        {lists.map((list) => (
          <div key={list.id}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">{list.name}</h2>
              <span className="text-zinc-400 text-sm">
                {list.posters.length} movies
              </span>
            </div>

           <Link href={`/list/${user.uid}/${list.id}`} className="block group">
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {list.posters.map((poster, index) => (
                    <img
                      key={index}
                      src={poster}
                      alt="Movie Poster"
                      className="w-[160px] h-[230px] flex-shrink-0 object-cover rounded-xl 
                      transition duration-300 
                      group-hover:scale-105 group-hover:z-20
                      hover:!scale-110 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                    />
                  ))}
                </div>

                <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}