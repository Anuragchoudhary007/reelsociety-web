"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default async function ReviewSection({ movieId, movieTitle }: any) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
  const [text, setText] = useState("");

  /* ================= FETCH REVIEWS ================= */

 useEffect(() => {
  async function fetchReviews() {
    const q = query(
      collection(db, "movies", movieId.toString(), "reviews"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReviews(data);
  }

  fetchReviews();
}, [movieId]);

  /* ================= SUBMIT REVIEW ================= */

const handleSubmit = async () => {
  if (!user || !text.trim()) return;

  await addDoc(
    collection(db, "movies", movieId.toString(), "reviews"),
    {
      userId: user.uid,
      username: user.displayName || user.email,
      comment: text,               // ✅ consistent field
      createdAt: serverTimestamp() // ✅ correct timestamp
    }
  );

  setText("");

  if (user) {
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      username: user.displayName,
      type: "reviewed",
      movieId,
      movieTitle,
      createdAt: serverTimestamp(),
    });
  }
};
  /* ================= UI ================= */

  return (
    <section className="px-16 py-16">
      <h2 className="text-2xl mb-8">User Reviews</h2>

      <div className="space-y-6 mb-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-white/10 pb-4"
          >
            <p className="text-white font-semibold">
              {review.username}
            </p>

            <p className="text-gray-300 mt-2">
              {review.comment}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {review.createdAt?.toDate?.().toLocaleString?.() || ""}
            </p>
          </div>
        ))}
      </div>

      {user && (
        <div className="flex flex-col gap-4">
          <textarea
            className="bg-black border border-white/20 p-3 rounded-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your review..."
          />

          <button
            onClick={handleSubmit}
            className="bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md transition"
          >
            Submit Review
          </button>
        </div>
      )}
    </section>
  );
}