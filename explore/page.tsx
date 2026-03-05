"use client";

import CinematicHome from "@/components/CinematicHome";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black text-white px-16 py-20">
      <h1 className="text-4xl mb-10">Explore Movies</h1>
      <CinematicHome />
    </div>
  );
}