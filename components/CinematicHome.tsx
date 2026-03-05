"use client";

import { useEffect, useState } from "react";
import MovieSection from "./MovieSection";
import HeroCarousel from "./HeroCarousel";

export default function CinematicHome() {
  const [trending, setTrending] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [t, tr, up] = await Promise.all([
          fetch("/api/tmdb/trending/movie/week"),
          fetch("/api/tmdb/movie/top_rated"),
          fetch("/api/tmdb/movie/upcoming"),
        ]);

        const trendingData = await t.json();
        const topRatedData = await tr.json();
        const upcomingData = await up.json();

        setTrending(trendingData.results || []);
        setTopRated(topRatedData.results || []);
        setUpcoming(upcomingData.results || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAll();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* 🎬 HERO CAROUSEL */}
      {trending.length > 0 && (
        <HeroCarousel movies={trending.slice(0, 5)} />
      )}

      <MovieSection title="Trending" movies={trending} />
      <MovieSection title="Top Rated" movies={topRated} />
      <MovieSection title="Upcoming" movies={upcoming} />
      <MovieSection
        title="ReelSociety Picks"
        movies={topRated.slice(5, 17)}
      />

    </main>
  );
}