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
import ListCard from "@/components/ListCard";

export default function ListsPage() {

  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {

    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "lists"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {

      const listsData = await Promise.all(

        snapshot.docs.map(async (docSnap) => {

          const listId = docSnap.id;

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

  }, [user?.uid]);



  return (

    <div className="max-w-7xl">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Your Lists
          </h1>

          <p className="text-gray-400">
            Rank and organize your favorite movies.
          </p>

        </div>

        <Link
          href="/create-list"
          className="px-6 py-2 bg-white text-black rounded-xl hover:scale-105 transition"
        >
          + Create List
        </Link>

      </div>



      {/* Empty state */}

      {lists.length === 0 ? (

        <div className="text-gray-400">
          No lists yet. Start building your rankings.
        </div>

      ) : (

        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">

          {lists.map((list) => (

            <ListCard
              key={list.id}
              list={list}
            />

          ))}

        </div>

      )}

    </div>

  );

}