"use client";

import Image from "next/image";
import Link from "next/link";

export default function PersonClient({ person }: any) {
  return (
    <main className="min-h-screen bg-black text-white px-20 py-20">

      {/* PROFILE HEADER */}
      <div className="flex gap-12">

        <Image
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "/placeholder.jpg"
          }
          width={300}
          height={450}
          alt={person.name}
          className="rounded-md shadow-lg"
        />

        <div className="max-w-2xl">

          <h1 className="text-4xl font-semibold mb-6">
            {person.name}
          </h1>

          <p className="text-gray-400 mb-6">
            {person.biography || "Biography not available."}
          </p>

          <div className="text-gray-300">
            <p>🎂 Born: {person.birthday}</p>
            <p>📍 Place: {person.place_of_birth}</p>
          </div>

        </div>

      </div>

      {/* KNOWN FOR */}
      <section className="mt-20">
        <h2 className="text-2xl mb-8 font-semibold">
          Known For
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {person.combined_credits?.cast
            ?.slice(0, 12)
            .map((credit: any) => (
              <Link key={credit.id} href={`/movie/${credit.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                  width={200}
                  height={300}
                  alt={credit.title || credit.name}
                  className="rounded-md hover:scale-105 transition"
                />
              </Link>
            ))}
        </div>
      </section>

    </main>
  );
}