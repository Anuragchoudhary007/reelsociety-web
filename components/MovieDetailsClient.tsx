"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import WatchlistButton from "./WatchlistButton";
import MovieRating from "./MovieRating";
import ReviewSection from "./ReviewSection";
import TrailerModal from "./TrailerModal";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetailsClient({ movie }: any) {
  const { user } = useAuth();

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isWatched, setIsWatched] = useState(false);

  if (!movie || !movie.id) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        Failed to load movie.
      </div>
    );
  }

  /* ================= WATCHED CHECK ================= */

  useEffect(() => {
    if (!user) return;

    async function checkWatched() {
      const ref = doc(
        db,
        "users",
        user.uid,
        "watched",
        movie.id.toString()
      );
      const snap = await getDoc(ref);
      setIsWatched(snap.exists());
    }

    checkWatched();
  }, [user, movie.id]);

  async function toggleWatched() {
    if (!user) return;

    const ref = doc(
      db,
      "users",
      user.uid,
      "watched",
      movie.id.toString()
    );

    const snap = await getDoc(ref);

    if (snap.exists()) {
      await deleteDoc(ref);
      setIsWatched(false);
} else {
  await setDoc(ref, {
    watchedAt: serverTimestamp(),
  });
  await addDoc(collection(db, "activity"), {
    userId: user.uid,
    username: user.displayName || user.email,
    type: "watched",
    movieId: movie.id,
    movieTitle: movie.title,
    createdAt: serverTimestamp(),
  });
  setIsWatched(true);
}
  }

  /* ================= DERIVED DATA ================= */

  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const director =
    movie.credits?.crew?.find((p: any) => p.job === "Director") || null;

  const providers =
    movie["watch/providers"]?.results?.IN?.flatrate || [];

  const trailerVideo = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const similarMovies = movie.similar?.results?.slice(0, 12) || [];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-end px-16 pb-24 overflow-hidden border-b border-white/10">

        {movie.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-semibold mb-4">
            {movie.title}
          </h1>

          <p className="text-gray-300 mb-6">
            {movie.overview}
          </p>

          <div className="flex gap-4 mb-6 flex-wrap">

            <WatchlistButton movie={movie} />

            <button
              onClick={toggleWatched}
              className={`px-6 py-3 rounded-md transition ${
                isWatched
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isWatched ? "✓ Watched" : "Mark as Watched"}
            </button>

            {trailerVideo && (
              <button
                onClick={() => setTrailerKey(trailerVideo.key)}
                className="px-6 py-3 border border-white/30 hover:bg-white/10 rounded-md"
              >
                Watch Trailer
              </button>
            )}

          </div>

          <MovieRating movieId={movie.id} />
        </div>
      </section>

      {/* ================= DIRECTOR ================= */}
      {director && (
        <section className="px-16 py-12 border-b border-white/10">
          <h2 className="text-2xl mb-4">Director</h2>
          <p className="text-gray-300">{director.name}</p>
        </section>
      )}

      {/* ================= CAST ================= */}
      {cast.length > 0 && (
        <section className="px-16 py-16 border-b border-white/10">
          <h2 className="text-2xl mb-8">Top Cast</h2>
          <div className="flex gap-6 overflow-x-auto">
            {cast.map((actor: any) => (
              <Link key={actor.id} href={`/person/${actor.id}`}>
                <div className="w-40 shrink-0">
                  {actor.profile_path ? (
                    <img
                      src={`${IMAGE_BASE}${actor.profile_path}`}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-800 rounded-lg" />
                  )}
                  <p className="mt-2 text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-400">
                    {actor.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= STREAMING PROVIDERS ================= */}
      {providers.length > 0 && (
        <section className="px-16 py-16 border-b border-white/10">
          <h2 className="text-2xl mb-8">Available On</h2>
          <div className="flex gap-6">
            {providers.map((p: any) => (
              <img
                key={p.provider_id}
                src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                className="h-12 rounded"
              />
            ))}
          </div>
        </section>
      )}

      {/* ================= REVIEWS ================= */}
      <ReviewSection movieId={movie.id} />

      {/* ================= SIMILAR / YOU MAY ALSO LIKE ================= */}
      {similarMovies.length > 0 && (
        <section className="px-16 py-20 border-t border-white/10">
          <h2 className="text-2xl mb-10">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {similarMovies.map((item: any) => (
              <Link key={item.id} href={`/movie/${item.id}`}>
                <div className="group cursor-pointer hover:scale-105 transition">
                  {item.poster_path && (
                    <img
                      src={`${IMAGE_BASE}${item.poster_path}`}
                      className="rounded-lg"
                    />
                  )}
                  <p className="mt-2 text-sm line-clamp-1">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <TrailerModal
        videoKey={trailerKey}
        onClose={() => setTrailerKey(null)}
      />

    </div>
  );
}