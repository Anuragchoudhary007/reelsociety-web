"use client";

import { useState } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateListModal({ onClose, onCreated }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createList = async () => {
    if (!user || !name.trim()) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "users", user.uid, "lists"), {
        name,
        owner: user.uid,
        public: true,
        likes: 0,
        createdAt: serverTimestamp(),
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-8 w-[400px] shadow-2xl">
        <h2 className="text-2xl font-serif mb-6 text-white">
          Create New Collection
        </h2>

        <input
          type="text"
          placeholder="Collection name"
          className="w-full p-3 rounded bg-black border border-zinc-700 text-white mb-6 focus:outline-none focus:border-white transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={createList}
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-300 transition"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}