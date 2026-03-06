"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export default function CreateList() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("public");

  const handleCreate = async () => {
    if (!user || !name) return;

    const listId = nanoid();
await setDoc(
  doc(db,"users",user.uid,"lists",listId),
  {
    name,
    owner:user.uid,
    visibility,
    isPublic: visibility === "public",
    createdAt: serverTimestamp(),
    likesCount:0
  }
)

    router.push(`/list/${user.uid}/${listId}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl mb-6 font-serif">Create New List</h1>

        <input
          type="text"
          placeholder="List Name"
          className="w-full p-3 bg-black border border-zinc-700 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full p-3 bg-black border border-zinc-700 rounded mb-6"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Private</option>
        </select>

        <button
          onClick={handleCreate}
          className="w-full py-3 bg-white text-black rounded-lg"
        >
          Create
        </button>
      </div>
    </main>
  );
}