"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const IMAGE = "https://image.tmdb.org/t/p/original";

export default function FeedPage() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeed() {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setFeed(data.feed || []);
    }

    fetchFeed();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <h1 className="text-4xl mb-10">ReelSociety Feed</h1>

      <div className="space-y-14">
        {feed.map((item: any, index: number) => {

          // 🎬 HERO ITEM
          if (index === 0) {
            return (
              <div key={index} className="relative h-[70vh] rounded-xl overflow-hidden">
                {item.image && (
                  <img
                    src={`${IMAGE}${item.image}`}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-16 left-16 max-w-2xl">
                  <p className="text-red-500 uppercase text-sm mb-2">
                    {item.type.replace("_", " ")}
                  </p>

                  <h2 className="text-5xl mb-6 font-semibold">
                    {item.title}
                  </h2>

                  <Link
                    href={
                      item.type === "person"
                        ? `/person/${item.id}`
                        : `/movie/${item.id}`
                    }
                  >
                    <button className="px-8 py-3 border border-white/30 rounded-lg hover:bg-white/10 transition">
                      Explore
                    </button>
                  </Link>
                </div>
              </div>
            );
          }

          // 📰 OTHER ITEMS
          return (
            <div key={index} className="flex gap-8 items-center group">
              {item.image && (
                <img
                  src={`${IMAGE}${item.image}`}
                  className="w-96 h-56 object-cover rounded-xl group-hover:scale-105 transition duration-500"
                />
              )}

              <div>
                <p className="text-red-500 uppercase text-xs mb-2">
                  {item.type.replace("_", " ")}
                </p>

                <h3 className="text-2xl mb-3 group-hover:text-red-500 transition">
                  {item.title}
                </h3>

                <Link
                  href={
                    item.type === "person"
                      ? `/person/${item.id}`
                      : `/movie/${item.id}`
                  }
                >
                  <button className="border border-white/30 px-5 py-2 rounded hover:bg-white/10 transition">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}