"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WatchlistButton from "./WatchlistButton";

const BACKDROP = "https://image.tmdb.org/t/p/original";

export default function HeroCarousel({ movies }: any) {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[index];

  return (
    <section className="relative h-[92vh] flex items-center px-24 overflow-hidden">

      {/* Background */}
      <img
        key={movie.id}
        src={`${BACKDROP}${movie.backdrop_path}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl">

        <h1 className="text-6xl font-display mb-6 leading-tight">
          {movie.title}
        </h1>

        <p className="text-gray-300 mb-6 text-lg">
          {movie.overview.slice(0, 180)}...
        </p>

        <div className="flex gap-4">
          <Link href={`/movie/${movie.id}`}>
            <button className="bg-red-600 px-6 py-3 rounded-2xl hover:bg-red-500 transition">
              Explore
            </button>
          </Link>

          <WatchlistButton movie={movie} />
        </div>

      </div>

      {/* 🔴 Netflix Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {movies.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === i
                ? "w-8 bg-red-600"
                : "w-3 bg-white/40 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </section>
  );
}