"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  fromUser: string;
  targetListId: string;
  movieTitle?: string;
  timestamp: any;
}

export default function SocialFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchFeed = async () => {
      // Step 1: get friends
      const friendsRef = collection(db, "friends", user.uid, "userFriends");
      const friendsSnap = await getDocs(friendsRef);

      const friendIds = friendsSnap.docs.map(doc => doc.id);

      if (friendIds.length === 0) return;

      // Step 2: get activities from friends
      const q = query(
        collection(db, "activities"),
        where("fromUser", "in", friendIds),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[];

      setActivities(data);
    };

    fetchFeed();
  }, [user]);

  return (
    <main className="min-h-screen bg-black text-white px-16 py-20">
      <h1 className="text-5xl font-serif mb-16">
        Friends Activity
      </h1>

      <div className="space-y-10 max-w-2xl">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="p-6 bg-zinc-900 rounded-2xl"
          >
            {activity.type === "created_list" && (
              <p>
                🎬 A friend created a new list.
              </p>
            )}

            {activity.type === "added_movie" && (
              <p>
                🍿 Added <strong>{activity.movieTitle}</strong> to a list.
              </p>
            )}

            {activity.type === "liked_list" && (
              <p>
                ❤️ Liked a list.
              </p>
            )}

            <Link
              href={`/list/${activity.fromUser}/${activity.targetListId}`}
              className="text-sm text-zinc-400 hover:underline mt-2 block"
            >
              View List →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}