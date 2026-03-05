"use client";

import MovieCard from "./MovieCard";
import Link from "next/link";

export default function MovieSection({
  title,
  movies = [],
}: any) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  return (
    <section className="px-16 py-20">
      <h3 className="text-2xl font-semibold mb-10">
        {title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {movies.slice(0, 12).map((movie: any) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </section>
  );
}