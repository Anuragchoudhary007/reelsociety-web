"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const IMAGE = "https://image.tmdb.org/t/p/original";

export default function FeedPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setFeed(data.feed || []);
      setLoading(false);
    }

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        Loading feed...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">

      <h1 className="text-4xl mb-12">ReelSociety Feed</h1>

      <div className="space-y-16">
        {feed.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden group"
          >
            {item.image && (
              <img
                src={`${IMAGE}${item.image}`}
                className="w-full h-[50vh] object-cover opacity-80 group-hover:scale-105 transition"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

            <div className="absolute bottom-10 left-10 max-w-2xl">
              <p className="uppercase text-sm text-red-500 mb-2">
                {item.type.replace("_", " ")}
              </p>

              <h2 className="text-3xl mb-4">
                {item.title}
              </h2>

              <p className="text-gray-300 mb-6 line-clamp-3">
                {item.description}
              </p>

              {item.type === "person" ? (
                <Link href={`/person/${item.id}`}>
                  <button className="px-6 py-3 border border-white/30 rounded hover:bg-white/10">
                    View Profile
                  </button>
                </Link>
              ) : (
                <Link href={`/movie/${item.id}`}>
                  <button className="px-6 py-3 border border-white/30 rounded hover:bg-white/10">
                    Explore
                  </button>
                </Link>
              )}
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}