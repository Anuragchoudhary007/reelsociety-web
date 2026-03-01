"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

interface Props {
  movie: any;
  onClose: () => void;
}

interface List {
  id: string;
  name: string;
}

export default function AddToListModal({ movie, onClose }: Props) {
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "lists")
      );

      setLists(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    };

    fetchLists();
  }, [user]);

  const addToList = async (listId: string) => {
    if (!user) return;

    await addDoc(
      collection(db, "users", user.uid, "lists", listId, "items"),
      {
        id: movie.id.toString(),
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        addedAt: serverTimestamp(),
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-8 w-[500px] shadow-2xl">
        <h2 className="text-2xl font-serif mb-6">
          Add to Collection
        </h2>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => addToList(list.id)}
              className="w-full p-4 bg-black rounded-xl border border-zinc-700 hover:border-white transition text-left"
            >
              {list.name}
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}