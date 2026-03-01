"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useRouter } from "next/navigation";

interface PublicList {
  id: string;
  owner: string;
  name: string;
  likes: number;
  followers: number;
}

export default function ExplorePage() {
  const [lists, setLists] = useState<PublicList[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPublicLists = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));

      let publicLists: PublicList[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const listsRef = collection(db, "users", userDoc.id, "lists");
        const q = query(listsRef, where("public", "==", true));
        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
          const data = doc.data();
          publicLists.push({
            id: doc.id,
            owner: userDoc.id,
            name: data.name,
            likes: data.likes || 0,
            followers: data.followers || 0,
          });
        });
      }

      setLists(publicLists);
    };

    fetchPublicLists();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-16 py-20">
      <h1 className="text-5xl font-serif mb-16">
        Explore Curated Archives
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {lists.map((list) => (
          <div
            key={list.id}
            className="p-8 bg-zinc-900 rounded-2xl hover:scale-105 transition cursor-pointer"
            onClick={() =>
              router.push(`/list/${list.owner}/${list.id}`)
            }
          >
            <h2 className="text-2xl font-serif mb-4">
              {list.name}
            </h2>

            <div className="text-zinc-400 text-sm flex gap-6">
              <span>❤ {list.likes}</span>
              <span>{list.followers} followers</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}